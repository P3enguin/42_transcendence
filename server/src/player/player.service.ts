import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import { send } from 'process';

function calculateXP(level: number, totalXP: number) {
  const requiredXP = Math.floor(100 * Math.pow(1.6, level - 1));
  const XP = level === 1 ? totalXP : totalXP - requiredXP;
  return {
    XP: Math.abs(XP),
    requiredXP,
  };
}

@Injectable()
export class PlayerService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  //-----------------------------------{ FRIEND }-----------------------------------\\

  Get_Player(req: Request) {
    const token = req.cookies['jwt_token'];
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = this.jwt.verify(token, { secret });
      const player = this.prisma.player.findUnique({
        where: {
          id: decoded.sub,
        },
      });
      return decoded;
    } catch (err) {
      console.log(err);
    }
  }
  //-----------------------------------{ Add a friend }-----------------------------
  async GetRequests(playerId: number, res: Response) {
    try {
      const requestsTo = await this.prisma.request.findMany({
        where: {
          toPlayerId: playerId,
        },
        include: {
          fromPlayer: {
            select: {
              nickname: true,
              avatar: true,
            },
          },
        },
      });
      const requestsFrom = await this.prisma.request.findMany({
        where: {
          fromPlayerId: playerId,
        },
        include: {
          toPlayer: {
            select: {
              nickname: true,
              avatar: true,
            },
          },
        },
      });

      // Put all strings in an array
      const allRequests = [...requestsFrom, ...requestsTo];

      // sort requests by date
      const sortedRequests = allRequests.sort(
        (a, b) => b.receivedAt.getTime() - a.receivedAt.getTime(),
      );

      // adding types (from or to) .
      const requestsWithType = sortedRequests.map((request) => {
        if (request.fromPlayerId === playerId) {
          return {
            ...request,
            type: 'from',
          };
        } else {
          return {
            ...request,
            type: 'to',
          };
        }
      });
      return res.status(200).json({ requests: requestsWithType });
    } catch (error) {
      return res.status(400).json({ message: 'An error has occurred' });
    }
  }

  async AddRequest(player: Player, receiver: string, res: Response) {
    const shortid = require('shortid');
    const reqId = shortid.generate();
    try {
      const receiverId = await this.prisma.player.findUnique({
        where: {
          nickname: receiver,
        },
        select: {
          id: true,
          block: {
            select: {
              nickname: true,
            },
          },
        },
      });
      if (!receiverId) throw new Error('Nickname Not Found');
      const blockedPlayers = receiverId.block.map(
        (blockedPlayer) => blockedPlayer.nickname,
      );

      if (blockedPlayers.includes(player.nickname)) {
        throw new Error('Cannot Send request');
      }

      const receivedRequests = await this.prisma.request.findMany({
        where: {
          toPlayerId: player.id,
          status: {
            in: ['accepted'],
          },
        },
      });
      if (receivedRequests.length != 0) throw new Error('Cannot Send request');
      const request = await this.prisma.request.create({
        data: {
          id: reqId,
          fromPlayerId: player.id,
          toPlayerId: receiverId.id,
        },
      });
      return res.json({ requestId: request.id });
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  async AcceptRequest(
    player: Player,
    senderId: number,
    requestId: string,
    res: Response,
  ) {
    try {
      const request = await this.prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      if (!request) throw new Error('Request not found');
      const check_friend = await this.prisma.player.findUnique({
        where: {
          id: player.id,
        },
        include: {
          friends: {
            select: {
              id: true,
            },
          },
          block: {
            select: {
              id: true,
            },
          },
        },
      });
      if (check_friend.friends.some((f) => f.id === senderId))
        throw new Error('Friend already exist');
      else if (check_friend.block.some((f) => f.id === senderId))
        throw new Error('You have been blocked');
      // connect first player

      await this.prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          friends: {
            connect: {
              id: senderId,
            },
          },
        },
      });

      // connect second player
      await this.prisma.player.update({
        where: {
          id: senderId,
        },
        data: {
          friends: {
            connect: {
              id: player.id,
            },
          },
        },
      });
      // change request status to accpeted
      await this.prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: 'accepted',
        },
      });
      // get other requests that might have been sent the player
      const otherRequests = await this.prisma.request.findMany({
        where: {
          fromPlayerId: player.id,
          toPlayerId: senderId,
          status: 'pending',
        },
      });
      //delete those requests
      await this.prisma.request.deleteMany({
        where: {
          id: { in: otherRequests.map((r) => r.id) },
        },
      });
      return res.json({ message: 'Success' });
    } catch (error) {
      if (error instanceof Error) {
        {
          console.log(error.message);
          return res.status(400).json({ error: error.message });
        }
        // await this.prisma.request.delete({
        //   where: {
        //     id: requestId,
        //   },
        // });
      }
      return res.status(400).json({ error: 'An error has occurred' });
    }
  }

  async rejectRequest(
    player: Player,
    senderId: number,
    requestId: string,
    res: Response,
  ) {
    try {
      const request = await this.prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      if (!request) throw new Error('Request not found');
      // change request status to accpeted
      await this.prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: 'rejected',
        },
      });
      return res.json({ message: 'Success' });
    } catch (error) {
      if (error instanceof Error) {
        {
          console.log(error.message);
          return res.status(400).json({ error: error.message });
        }
      }
      return res.status(400).json({ error: 'An error has occurred' });
    }
  }

  async CancelRequest(res: Response, player: Player, requestId: string) {
    const shortid = require('shortid');
    try {
      const request = await this.prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      if (request.status == 'accepted')
        throw new Error('Cannot cancel request');
      else {
        await this.prisma.request.delete({
          where: {
            id: requestId,
          },
        });
      }
      return res.json({ message: 'Success' });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        return res.status(400).json({ error: err.message });
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  //----------------{ get the list if all friends }--------------------

  async GetFriends(nickname: string, req?: Request, res?: Response) {
    // const player = this.Get_Player(req);
    try {
      const FriendList = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        include: {
          friends: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
            },
          },
        },
      });
      if (res) return res.status(200).json(FriendList.friends);
      else return FriendList.friends;
    } catch (error) {
      if (res) {
        if (error instanceof PrismaClientKnownRequestError) {
          console.log(error.message);
          return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: 'Unexpected error has occurred' });
      } else return null;
    }
  }
  //-----------------------------------{ Block }-----------------------------------\\
  //-----------------------------------{ block a friends }--------------------------

  async BlockFriend(player: Player, friend: string, res: Response) {
    try {
      if (player.nickname == friend) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const friendId = await this.prisma.player.findUnique({
        where: {
          nickname: friend,
        },
        select: {
          id: true,
        },
      });

      if (!friendId) {
        return res.status(404).json({ error: 'Friend not found' });
      }

      await this.prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          friends: {
            disconnect: {
              id: friendId.id,
            },
          },
          block: {
            connect: {
              id: friendId.id,
            },
          },
        },
      });

      await this.prisma.player.update({
        where: {
          id: friendId.id,
        },
        data: {
          friends: {
            disconnect: {
              id: player.id,
            },
          },
        },
      });

      const oldRequestFrom = await this.prisma.request.findMany({
        where: {
          fromPlayerId: player.id,
          toPlayerId: friendId.id,
        },
      });
      const oldRequestTo = await this.prisma.request.findMany({
        where: {
          fromPlayerId: friendId.id,
          toPlayerId: player.id,
        },
      });
      const allCommonRequest = [...oldRequestFrom, ...oldRequestTo];
      //delete those requests
      await this.prisma.request.deleteMany({
        where: {
          id: { in: allCommonRequest.map((r) => r.id) },
        },
      });
      res.status(200).json({ message: 'Friend blocked successfully' });
    } catch (error) {
      console.error('Error blocking friend:', error);
      res.status(400).json({ error: 'Internal server error' });
    }
  }

  async GetBlockedFriends(player: Player, res: Response) {
    try {
      const BlockedList = await this.prisma.player.findUnique({
        where: {
          nickname: player.nickname,
        },
        select: {
          block: {
            select: {
              nickname: true,
              avatar: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      });
      res.status(200).json(BlockedList.block);
    } catch (error) {
      console.error('Error getting blocked :', error);
      res.status(400).json({ error: 'Internal server error' });
    }
  }

  async Unblock(nickname: string, res: Response, player: Player) {
    try {
      const blockedId = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        select: {
          id: true,
        },
      });

      if (!blockedId) {
        return res.status(404).json({ error: 'nickname not found' });
      }

      await this.prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          block: {
            disconnect: {
              id: blockedId.id,
            },
          },
        },
      });
      res.status(200).json({ message: 'unblocked successfully' });
    } catch (error) {
      console.error('Error unblocking friend:', error);
      res.status(400).json({ error: 'Internal server error' });
    }
  }
  //-----------------------{ Fetching and changing Data }----------------------
  async getDataID(id: number, res: Response) {
    try {
      const playerStatus = await this.prisma.player.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          nickname: true,
          firstname: true,
          lastname: true,
          coins: true,
          avatar: true,
          wallpaper: true,
          joinAt: true,
          Is2FAEnabled: true,
          wins: true,
          loss: true,
          status: {
            select: {
              rank: true,
              level: true,
              achivement: true,
              XP: true,
            },
          },
        },
      });

      const rankId = playerStatus.status.rank.rankId;
      const level = playerStatus.status.level;

      const xp = calculateXP(level, Number(playerStatus.status.XP));

      let winRatio = (
        (playerStatus.wins.length /
          (playerStatus.wins.length + playerStatus.loss.length)) *
        100
      ).toFixed(2);

      if (winRatio == 'NaN') winRatio = '00.00';
      //deleting status from player object;
      const { status, ...player } = playerStatus;
      return res.status(200).json({ player, rankId, winRatio, level, xp });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }

  async getDataNickname(senderId: number, nickname: string, res: Response) {
    try {
      const playerStatus = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        select: {
          id: true,
          nickname: true,
          firstname: true,
          lastname: true,
          coins: true,
          avatar: true,
          wallpaper: true,
          joinAt: true,
          friends: {
            select: {
              id: true,
            },
          },
          block: {
            select: {
              id: true,
            },
          },
          wins: true,
          loss: true,
          status: {
            select: {
              rank: true,
              level: true,
              achivement: true,
              XP: true,
            },
          },
        },
      });
      if (!playerStatus) throw new Error('Nickname not found');

      let isFriend = false;
      if (playerStatus.friends)
        isFriend = playerStatus.friends.some((f) => f.id === senderId);

      let blockedByFriend = false;
      if (playerStatus.block)
        blockedByFriend = playerStatus.block.some((f) => f.id === senderId);

      const sender = await this.prisma.player.findUnique({
        where: {
          id: senderId,
        },
        select: {
          block: {
            select: {
              id: true,
            },
          },
        },
      });

      let blockedByPlayer = false;
      if (sender.block)
        blockedByPlayer = sender.block.some((f) => f.id == playerStatus.id);

      const request = await this.prisma.request.findFirst({
        where: {
          fromPlayerId: senderId,
          toPlayerId: playerStatus.id,
          NOT: {
            status: 'rejected',
          },
        },
        select: {
          status: true,
          id: true,
        },
      });
      const level = playerStatus.status.level;
      const rankId = playerStatus.status.rank.rankId;
      const xp = calculateXP(level, Number(playerStatus.status.XP));
      let winRatio = (
        (playerStatus.wins.length /
          (playerStatus.wins.length + playerStatus.loss.length)) *
        100
      ).toFixed(2);

      if (winRatio == 'NaN') winRatio = '00.00';
      const { status, friends, block, wins, loss, ...player } = playerStatus;
      return res.status(200).json({
        player,
        request,
        isFriend,
        blockedByPlayer,
        blockedByFriend,
        rankId,
        winRatio,
        level,
        xp,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }

  async changeData(data: any, res: Response) {
    try {
      await this.prisma.player.update({
        where: {
          id: data.user.id,
        },
        data: {
          nickname: data.nickname,
          firstname: data.firstname,
          lastname: data.lastname,
        },
      });
      return res.status(201).json({ success: 'Data has been changed' });
    } catch (e) {
      var error;
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          error = 'Nickname already exist';
        } else {
          error = 'An Error has occurred';
        }
      }
      // error handling for invalid session token
      return res.status(400).send(JSON.stringify({ error: error }));
    }
  }

  async changePassowrd(data: any, res: Response) {
    try {
      const hash = await argon2.hash(data.password);
      await this.prisma.player.update({
        where: {
          id: data.user.id,
        },
        data: {
          password: hash,
        },
      });
      return res.status(201).json({ success: 'Password changed successfully' });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred' });
    }
  }
  async updatePFP(req: Request, fileName: string) {
    const token = req.cookies['jwt_token'];
    /* not necessary , we already using auth guard
			 but protection is good , Highly recommended hh*/
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = this.jwt.verify(token, { secret });
      const player = await this.prisma.player.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          avatar: true,
        },
      });
      if (player.avatar != 'default.png') {
        fs.unlink(
          process.cwd() + '/uploads/avatars/' + player.avatar,
          (error) => {
            if (error) {
              console.log(error);
            }
          },
        );
      }
      await this.prisma.player.update({
        where: {
          id: decoded.id,
        },
        data: {
          avatar: fileName,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async updateWallpaper(req: Request, fileName: string) {
    const token = req.cookies['jwt_token'];
    try {
      const secret = process.env.JWT_SECRET;
      const decoded = this.jwt.verify(token, { secret });
      const player = await this.prisma.player.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          wallpaper: true,
        },
      });
      if (player.wallpaper != 'wallpaper.png') {
        fs.unlink(
          process.cwd() + '/uploads/wallpapers/' + player.wallpaper,
          (error) => {
            if (error) {
              console.log(error);
            }
          },
        );
      }
      await this.prisma.player.update({
        where: {
          id: decoded.id,
        },
        data: {
          wallpaper: fileName,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  //----------------------------------{Titles}-----------------------------------

  // get the current title
  async getCurrentTitle(res: Response, nickname: string) {
    try {
      const occupiedTitle = await this.prisma.titles_status.findFirst({
        where: {
          status: {
            player: {
              nickname: nickname,
            },
          },
          occupied: true,
        },
        select: {
          titles: {
            select: {
              name: true,
            },
          },
        },
      });
      return res.status(200).json({ currentTitle: occupiedTitle.titles.name });
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  // update Current Title
  async updateCurrentTitle(user: any, res: Response, titleName: string) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id: user.id,
        },
        select: {
          statusId: true,
        },
      });

      const title = await this.prisma.titles.findUnique({
        where: { name: titleName },
        select: { id: true },
      });

      const occupiedTitle = await this.prisma.titles_status.update({
        where: {
          statusId_titleId: { statusId: player.statusId, titleId: title.id },
        },
        data: { occupied: true },
      });

      return res.status(200).json({ message: 'Title updated' });
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  //----------------------------------{Search}-----------------------------------
  async getDataSearch(res: Response, searchParam: string) {
    // Only fetching Users for the moment
    try {
      const data = await this.prisma.player.findMany({
        where: {
          nickname: {
            contains: searchParam,
          },
        },
        select: {
          nickname: true,
          avatar: true,
        },
      });
      return res.status(200).json({ players: data });
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  //----------------------------------{LeaderBoard}-----------------------------------
  async getLeaderBoardByLevel(res: Response, limit: number) {
    try {
      const data = await this.prisma.status.findMany({
        select: {
          player: {
            select: {
              nickname: true,
              avatar: true,
            },
          },
          level: true,
          XP: true,
        },
        take: limit,
        orderBy: [
          {
            level: 'desc',
          },
          {
            XP: 'desc',
          },
        ],
      });

      const serializedData = data.map((item) => ({
        ...item,
        XP: item.XP.toString(),
      }));

      return res.status(200).json(serializedData);
    } catch (error) {
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  async getGamesPlayed(res: Response, nickname: string) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        include: {
          wins: {
            select: {
              playedAt: true,
              score: true,
              winnerId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
              loserId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
          },
          loss: {
            select: {
              playedAt: true,
              score: true,
              winnerId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
              loserId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!player) {
        // Handle the case when the player is not found
        return res.status(404).json({ message: 'Player not found' });
      }

      const allGames = [...player.wins, ...player.loss];

      const gamesPlayed = allGames.map((game) => {
        const isPlayerWinner = game.winnerId.id === player.id;
        const isPlayerLoser = game.loserId.id === player.id;

        return {
          ...game,
          isPlayerWinner,
          isPlayerLoser,
        };
      });

      // Sort gamesPlayed by date
      const sortedGamesPlayed = gamesPlayed.sort(
        (a, b) => b.playedAt.getTime() - a.playedAt.getTime(),
      );

      return res.status(200).json(sortedGamesPlayed);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(400).json({ message: 'Internal server error' });
    }
  }

  async getRankedGames(res: Response, nickname: string) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        include: {
          wins: {
            where: {
              type: 'RANKED',
            },
            include: {
              winnerId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
              loserId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
          },
          loss: {
            where: {
              type: 'RANKED',
            },
            include: {
              winnerId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
              loserId: {
                select: {
                  id: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });

      if (!player) {
        // Handle the case when the player is not found
        return res.status(404).json({ message: 'Player not found' });
      }

      const allGames = [...player.wins, ...player.loss];

      const gamesPlayed = allGames.map((game) => {
        const isPlayerWinner = game.winnerId.id === player.id;
        const isPlayerLoser = game.loserId.id === player.id;

        return {
          ...game,
          isPlayerWinner,
          isPlayerLoser,
        };
      });

      // Sort gamesPlayed by date
      const sortedGamesPlayed = gamesPlayed.sort(
        (a, b) => b.playedAt.getTime() - a.playedAt.getTime(),
      );
      return res.status(200).json(sortedGamesPlayed);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(400).json({ message: 'Internal server error' });
    }
  }

  async getRankStats(res: Response, nickname: string) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        include: {
          status: {
            select: {
              rank: true,
            },
          },
        },
      });
      if (!player) {
        // Handle the case when the player is not found
        return res.status(404).json({ message: 'Player not found' });
      }
      return res.status(200).json(player.status.rank);
      // return res.status(200).json(sortedGamesPlayed);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(400).json({ message: 'Internal server error' });
    }
  }
}
