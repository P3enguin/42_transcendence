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

  async getDataNickname(senderID:number,nickname: string, res: Response) {
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
        },
      });

      const request = await this.prisma.request.findFirst({
        where: {
          toPlayerId: player.id,
          fromPlayerId: senderID,
        },
        select : {
          status : true,
        }
      });

      return res.status(200).json({ player,request});
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

  async rejectRequest() {}

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
      return res.json({ message: 'Success' });
    } catch (err) {
      if (err instanceof Error)
        return res.status(400).json({ error: err.message });
      return res.status(400).json({ error: 'An Error has Occured' });
    }
  }

  async AcceptFriend(player: Player, nickname: string, requestId: string) {
    console.log('nickname: ' + player.nickname);
    const check_friend = await this.prisma.player.findUnique({
      where: {
        id: player.id,
      },
      include: {
        friends: {
          select: {
            nickname: true,
          },
        },
        block: {
          select: {
            nickname: true,
          },
        },
      },
    });
    if (
      !check_friend.friends.some((f) => f.nickname === nickname) &&
      !check_friend.block.some((f) => f.nickname === nickname)
    ) {
      await this.prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          friends: {
            connect: {
              nickname: nickname,
            },
          },
        },
      });
      await this.prisma.player.update({
        where: {
          nickname: nickname,
        },
        data: {
          friends: {
            connect: {
              nickname: player.nickname,
            },
          },
        },
      });
      await this.prisma.request.delete({
        where: {
          id: requestId,
        },
      });
      return 'Friend added successfully';
    } else {
      console.log(nickname, 'exist !');
      return 'Friend already exist !';
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
          friends: true,
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
          error = 'An Error has occured';
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
      return res.status(400).json({ error: 'An error has occured' });
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
      return res.status(400).json({ error: 'An Error has occured' });
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
      return res.status(400).json({ error: 'An Error has occured' });
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
}
