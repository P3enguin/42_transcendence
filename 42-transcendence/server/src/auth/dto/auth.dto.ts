import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	nickname: string

	@IsString()
	avatar: string
}