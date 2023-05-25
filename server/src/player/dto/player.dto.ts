import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DataDTO {


  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

}

export class PasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;
}
