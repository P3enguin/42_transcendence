import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy (
	Strategy,
	'jwt' ){

		constructor(config: ConfigService, private prisma: PrismaService) {
			super({
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: config.get('JWT_SECRET'),
			});
		}
		async validate (
			data: {
				email: string;
				nickname: string; })
			{
				const player = await this.prisma.player.findUnique({
					where: {
						nickname: data.nickname,
					},
				});
				return player;
			}
}