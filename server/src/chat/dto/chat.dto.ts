import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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