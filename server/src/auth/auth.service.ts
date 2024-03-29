import { ForbiddenException, Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, signDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { authenticator } from 'otplib';
import * as argon2 from 'argon2';
import { toDataURL } from 'qrcode';
import { playerStrat, UserToken } from './Interfaces/Interface';
import { AchivementService } from 'src/achivement/achivement.service';
import { TitleService } from 'src/title/title.service';
import { RankService } from 'src/rank/rank.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private achiv: AchivementService,
    private title: TitleService,
    private rank: RankService,
  ) {}

  async checkUser(user: playerStrat, res: Response) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          nickname: true,
          email: true,
          avatar: true,
          Is2FAEnabled: true,
        },
      });
      // The player does not exist: create a short-live jwt and redirect to complete the profile
      if (!player) {
        const secret = process.env.JWT_SESSION;
        const jwtSession = await this.jwt.signAsync(user, {
          expiresIn: '1d',
          secret: secret,
        });
        res.status(200).cookie('jwt_session', jwtSession, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
        });
        res.redirect(process.env.FRONTEND_HOST + '/login');

        // Player exists and has 2FA enabled : create a short-live jwt signed with different key and redirect to /verify
      } else if (player.Is2FAEnabled) {
        const secret = process.env.JWT_2FA;
        const payload = {
          id: player.id,
        };
        const jwt2FA = await this.jwt.signAsync(payload, {
          expiresIn: '1d',
          secret: secret,
        });
        res.status(200).cookie('jwt_2FA', jwt2FA, {
          httpOnly: true,
          // secure: true,
          maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
        });
        res.redirect(process.env.FRONTEND_HOST + '/verify');
      } else {
        const jwtToken = await this.signToken(player.id, player.nickname);
        res.cookie('jwt_token', jwtToken.access_token, {
          httpOnly: true,
          // secure: true,
          maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
        });
        res.redirect(process.env.FRONTEND_HOST + '/profile');
      }
    } catch (e) {
      console.log(e);
      if (e instanceof PrismaClientKnownRequestError) {
        console.log(`code : ${e.code} ,message : ${e.message}`);
      }
    }
  }

  async signup(req: Request, res: Response, dto: AuthDto) {
    const secret: string = process.env.JWT_SECRET;
    try {
      const hash = await argon2.hash(dto.password);
      const player = await this.prisma.player.create({
        data: {
          email: dto.email,
          nickname: dto.nickname,
          firstname: dto.firstname,
          lastname: dto.lastname,
          password: hash,
          coins: dto.coins,
          Secret2FA: '',
          status: {
            create: {},
          },
          // equipedTitle: 1,
        },
      });

      await this.achiv.assignAchiv(player.statusId);
      await this.title.assignTitle(player.statusId);
      // await this.prisma.status.update({
      //   where: {
      //     id: player.statusId,
      //   },
      //   data: {
      //     title: {
      //       update: {
      //         where: {
      //           statusId_titleId: {
      //             statusId: player.statusId,
      //             titleId: 16,
      //           },
      //         },
      //         data: {
      //           occupied: true,
      //         },
      //       },
      //     },
      //   },
      // });
      await this.rank.assignRanks(player.statusId);
      const jwtToken = await this.signToken(player.id, player.nickname);
      res.cookie('jwt_token', jwtToken.access_token, {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
      });
      res.clearCookie('jwt_session');
      res.status(201).send({ success: true });
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
      console.log(e);
      return res.status(401).send(JSON.stringify({ error: error }));
    }
  }

  async signin(res: Response, dto: signDTO) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          nickname: dto.nickname,
        },
        select: {
          id: true,
          password: true,
          nickname: true,
          Is2FAEnabled: true,
        },
      });
      if (!player) throw new ForbiddenException('Nickname Not found');
      if (await argon2.verify(player.password, dto.password)) {
        if (player.Is2FAEnabled) {
          const secret = process.env.JWT_2FA;
          const jwt2FA = await this.jwt.signAsync(player, {
            expiresIn: '1d',
            secret: secret,
          });
          res.status(200).cookie('jwt_2FA', jwt2FA, {
            httpOnly: true,
            // secure: true,
            maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
          });
          return res.json({ Is2FAenabled: true });
        } else {
          const token = await this.signToken(player.id, player.nickname);
          res.cookie('jwt_token', token.access_token, {
            httpOnly: true,
            // secure: true,
            maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
          });
          res.status(200).send({ Is2FAenabled: false });
        }
      } else {
        throw new ForbiddenException('Password Incorrect');
      }
    } catch (err) {
      res.status(401).json({ error: err });
    }
  }

  async signToken(
    playerId: number,
    nickname: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      id: playerId,
      nickname,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }

  async logout(req: Request, res: Response) {
    const token = req.cookies['jwt_token'];
    try {
      await this.prisma.invalidToken.create({
        data: {
          token: token,
          ExpireDate: new Date(req.body.user.jwt.exp * 1000),
        },
      });
      res
        .status(201)
        .clearCookie('jwt_token')
        .json({ success: 'logged out succesfully' });
    } catch (err) {
      console.log(err);
      return res.status(401).json({ error: err });
    }
  }

  // to changle later with a user inteface
  async enable2FA(user: UserToken, res: Response) {
    const secret = authenticator.generateSecret();
    try {
      // check if the user already has 2FA enable
      const player = await this.prisma.player.findUnique({
        where: {
          id: user.id,
        },
        select: {
          Is2FAEnabled: true,
        },
      });
      if (player.Is2FAEnabled)
        return res
          .status(401)
          .json({ error: 'You have already activated 2FA !' });

      await this.prisma.player.update({
        where: {
          id: user.id,
        },
        data: {
          Secret2FA: secret,
        },
      });
      const otpauth = authenticator.keyuri(
        user.id.toString(),
        'ft_transcendence',
        secret,
      );
      toDataURL(otpauth, (err, imageUrl) => {
        if (err) {
          console.log('Error while generating QR');
          return res.status(500).json({ error: 'Error while generating QR' });
        }
        return res.status(200).json({ qrcode: imageUrl });
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: 'An error has occurred' });
    }
  }

  async confirm2FA(user: UserToken, token: string, res: Response) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id: user.id,
        },
        select: {
          Secret2FA: true,
          Is2FAEnabled: true,
        },
      });
      const secret: string = player.Secret2FA;
      if (authenticator.verify({ token, secret })) {
        await this.prisma.player.update({
          where: {
            id: user.id,
          },
          data: {
            Is2FAEnabled: true,
          },
        });
        res.status(200).json({ success: 'Successfully' });
      } else {
        res.status(400).json({ error: 'Invalid Token' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'An error has occurred' });
    }
  }

  async deactivate2FA(user: UserToken, password: string, res: Response) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id: user.id,
        },
        select: {
          password: true,
        },
      });
      if (await argon2.verify(player.password, password)) {
        await this.prisma.player.update({
          where: {
            id: user.id,
          },
          data: {
            Is2FAEnabled: false,
            Secret2FA: '',
          },
        });
        return res
          .status(200)
          .json({ success: 'successfully deactivated 2FA' });
      } else {
        throw new ForbiddenException('Password incorrect');
      }
    } catch (error) {
      res.status(403).json({ error: error });
    }
  }

  async verify2FA(user: UserToken, res: Response, token: string) {
    try {
      const player = await this.prisma.player.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          nickname: true,
          Secret2FA: true,
          Is2FAEnabled: true,
        },
      });
      const secret: string = player.Secret2FA;
      if (authenticator.verify({ token, secret })) {
        const token = await this.signToken(player.id, player.nickname);
        res.cookie('jwt_token', token.access_token, {
          httpOnly: true,
          // secure: true,
          maxAge: 1000 * 60 * 60 * 24 // expire after 24 hours
        });
        res.status(200).send({ success: true });
      } else {
        res.status(400).json({ error: 'Invalid Token' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'An error has occurred' });
    }
  }
}
