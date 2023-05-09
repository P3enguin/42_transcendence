import { IsNotEmpty, IsNumber, IsString, IsInt, IsOptional, } from 'class-validator';

export class ChatDto {

    @IsString()
    @IsNotEmpty()
    channelId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    Topic: string;

    @IsString()
    @IsNotEmpty()
    Key: string;


    @IsNumber()
    @IsNotEmpty()
    memberLimit: number;

    @IsString()
    @IsNotEmpty()
    stats: string;

    
    IsChannel: boolean;
}

export class JoinChannelDto {
  @IsString()
  channelId: string;

  @IsString()
  @IsOptional()
  key?: string;
}
