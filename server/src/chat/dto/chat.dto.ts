import { IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsString()
  channelId: string;

  @IsString()
  @IsOptional()
  key?: string;
}

export class BanMemberDto {
  @IsString()
  channelId: string;

  @IsString()
  memberNickname: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
