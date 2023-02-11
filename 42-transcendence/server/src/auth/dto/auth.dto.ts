
import {
    validate,
    validateOrReject,
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    Min,
    Max,
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email : string;
}