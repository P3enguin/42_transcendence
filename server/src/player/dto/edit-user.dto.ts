import { IsEmail, IsOptional, IsString } from "class-validator";

export class EditPlayerDto {
	@IsEmail()
	@IsOptional()
	email?: string;
	
	@IsString()
	@IsOptional()
	nickname?: string;
	
	@IsString()
	@IsOptional()
	avatar?: string;
}