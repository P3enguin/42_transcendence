import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AchivementService } from 'src/achivement/achivement.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private achiv: AchivementService,
  ) {}

  
  async signup(dto: AuthDto) {
    try {
      const achv =   await this.achiv.fillAvhievememt();
      const player = await this.prisma.player.create({
        data: {
          email: dto.email,
          nickname: dto.nickname,
          status:  {
            create: {
              achivement: achv,
            },
          },
        },
      });

      return this.signToken(player.id, player.email);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
        ) {
          if (error.code === 'P2002') {
            throw new ForbiddenException(
              'Credentials taken',
              );
            }
          }
          throw error;
        }
      }

  async signin(dto: AuthDto) {
    const player =
      await this.prisma.player.findUnique({
        where: {
          nickname: dto.nickname,
        },
      });
    if (!player)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    return this.signToken(player.id, player.email);
  }

  async signToken(
    playerId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: playerId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }
}
