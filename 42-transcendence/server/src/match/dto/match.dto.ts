import { IsNotEmpty, Contains, IsDate } from 'class-validator'

export class MatchDto {
	// @IsNotEmpty()

	players: string[2][];

	// @IsNotEmpty()
	// @Contains(" - ")
	scoor: string;
	
	// @IsNotEmpty()
	// @IsDate()
	playerAt: Date;
}