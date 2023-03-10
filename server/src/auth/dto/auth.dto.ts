import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;
  
  // @IsString()
  // avatar: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;
  
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsNumber()
  coins:number
}

export class singDTO {

  @IsString()
  @IsNotEmpty()
  nickname: string;
  

  @IsString()
  @IsNotEmpty()
  password: string;

}

