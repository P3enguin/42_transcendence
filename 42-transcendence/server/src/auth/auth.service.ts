import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { PrismaClientInitializationError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
	) {}

	async	signup(dto: AuthDto) {
		try {
			const player = await this.prisma.player.create({
				data: {
					email: dto.email,
					nickname: dto.nickname,
					avatar: dto.avatar,
				},
			});
			return this.signToken(player.id, player.email, player.nickname, player.avatar);
		}catch (err) {
			if (err instanceof PrismaClientInitializationError) {
				throw new ForbiddenException('player s informations incorrect');
			}
		}
	}

	async signin (dto: AuthDto) {
		const player = await this.prisma.player.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!player)
			throw new ForbiddenException('Player information incorrects');
		
		return this.signToken(player.id, player.email, player.nickname, player.avatar);
	}

	async signToken(id: number, email: string, nickname: string, avatar: string): 
	Promise<{access_token: string}> {

		const player = {
			id: id,
			email: email,
			nicknameL: nickname,
			avatar: avatar,
		}

		const secret = this.config.get('JWT_SECRET');

		const token = await this.jwt.signAsync(player, {
			expiresIn: '1h',
			secret: secret,
		})

		return {
			access_token: token,
		};
	}
}
