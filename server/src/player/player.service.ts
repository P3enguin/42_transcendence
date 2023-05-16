import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Player } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';
import { AuthDto } from 'src/prisma/dto';
import * as argon2 from 'argon2';
import * as fs from 'fs';

@Injectable()
export class PlayerService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async getDataNickname(senderId: number, nickname: string, res: Response) {
    try {
      const player = await this.prisma.player.findUnique({
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
        },
      });
      if (!player) throw new Error('Nickname not found');
      let isFriend = false;
      if (player.friends)
        isFriend = player.friends.some((f) => f.id === senderId);

      const request = await this.prisma.request.findFirst({
        where: {
          fromPlayerId: senderId,
          toPlayerId: player.id,
          NOT: {
            status: 'rejected',
          },
        },
        select: {
          status: true,
          id: true,
        },
      });
      console.log(request);
      return res.status(200).json({ player, request, isFriend });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }

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
    const receiverId = await this.prisma.player.findUnique({
      where: {
        nickname: receiver,
      },
      select: {
        id: true,
      },
    });
    if (!receiverId) throw new Error('Nickname Not Found');
    try {
      const existingRequest = await this.prisma.request.findFirst({
        where: {
          toPlayerId: receiverId.id,
          fromPlayerId: player.id,
          NOT: {
            status: 'rejected',
          },
        },
      });
      if (existingRequest) throw new Error('Request already sent');

      const request = await this.prisma.request.create({
        data: {
          id: reqId,
          fromPlayerId: player.id,
          toPlayerId: receiverId.id,
        },
      });
      return res.json({ requestId: request.id });
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ error: err.message });
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
      // change request status to accpeted
      await this.prisma.request.update({
        where: {
          id: requestId,
        },
        data: {
          status: 'rejected',
        },
      });
      // get other requests that might have been sent the player
      // const otherRequests = await this.prisma.request.findMany({
      //   where: {
      //     fromPlayerId: player.id,
      //     toPlayerId: senderId,
      //     status: 'pending',
      //   },
      // });
      // //delete those requests
      // await this.prisma.request.deleteMany({
      //   where: {
      //     id: { in: otherRequests.map((r) => r.id) },
      //   },
      // });
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

  async CancelRequest(res: Response, player: Player, requestId: string) {
    const shortid = require('shortid');
    try {
      await this.prisma.request.delete({
        where: {
          id: requestId,
        },
      });
      return res.json({ message: 'Success' });
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError)
        return res.status(400).json({ error: err.message });
      return res.status(400).json({ error: 'An Error has occurred' });
    }
  }

  //-----------------------------------{ get the list if all friends }

  async GetFriends(req: Request, res: Response, nickname: string) {
    // const player = this.Get_Player(req);
    try {
      const FriendList = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        include: {
          friends: {
            select: {
              nickname: true,
              avatar: true,
            },
          },
        },
      });
      return res.status(200).json(FriendList.friends);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error.message);
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: 'Unexpected error has occurred' });
    }
  }
  //-----------------------------------{ Block }-----------------------------------\\
  //-----------------------------------{ block a friends }

  async BlockFriend(req: Request, friendId: number) {
    const player = this.Get_Player(req);
    const check_friend = await this.prisma.player.findUnique({
      where: {
        id: player.sub,
      },
      select: {
        friends: {
          select: {
            id: true,
          },
        },
      },
    });
    if (check_friend.friends.some((f) => f.id === friendId)) {
      try {
        await this.prisma.player.update({
          where: {
            id: player.sub,
          },
          data: {
            friends: {
              disconnect: {
                id: friendId,
              },
            },
            block: {
              connect: {
                id: friendId,
              },
            },
          },
        });
      } catch (err) {
        console.log("friend doesn't exist!", err);
      }
      return ' friend Blocked';
    } else return "friend doesn't exist!";
  }

  async GetBlockedFriends(req: Request) {
    const player = this.Get_Player(req);
    const BlockedList = await this.prisma.player.findUnique({
      where: {
        id: player.sub,
      },
      include: {
        block: true,
      },
    });
    return BlockedList;
  }

  //-----------------------{ Fetching and changing Data }----------------------
  async getDataID(id: number, res: Response) {
    try {
      const player = await this.prisma.player.findUnique({
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
        },
      });
      return res.status(200).json({ player });
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
      console.log(hash);
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

  async getGamesPlayed(res: Response, nickname: string) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          nickname: nickname,
        },
        include: {
          wins: {
            select: {
              playerAt: true,
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
              playerAt: true,
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
        (a, b) => b.playerAt.getTime() - a.playerAt.getTime(),
      );

      return res.status(200).json(sortedGamesPlayed);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
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
        (a, b) => b.playerAt.getTime() - a.playerAt.getTime(),
      );
      return res.status(200).json(sortedGamesPlayed);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
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
      console.log(player.status.rank);
      if (!player) {
        // Handle the case when the player is not found
        return res.status(404).json({ message: 'Player not found' });
      }
      return res.status(200).json(player.status.rank);
      // return res.status(200).json(sortedGamesPlayed);
    } catch (error) {
      // Handle the error appropriately
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
