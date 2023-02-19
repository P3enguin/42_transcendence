import { IsNotEmpty, Contains, IsDate } from 'class-validator'

export class MatchDto {

	@IsNotEmpty()
	winner: number;
	
	@IsNotEmpty()
	loser: number;

	// @Contains(" - ")
	@IsNotEmpty()
	scoor: string;
	
	// @IsNotEmpty()
}