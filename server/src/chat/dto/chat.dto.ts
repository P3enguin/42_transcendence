import { IsInt, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  channelId: string;

  @IsString()
  @IsOptional()
  key?: string;
}
