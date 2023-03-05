import { IsNotEmpty, Contains, IsDate, IsNumber, IsSemVer, IsString } from 'class-validator'

export class MatchDto {

	@IsNotEmpty()
	winner: number;
	
	@IsNotEmpty()
	loser: number;
	
	@IsString()
	@IsNotEmpty()
	scoor: string;

}