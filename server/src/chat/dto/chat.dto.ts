import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsInt()
  memberLimit: number;

  @IsString()
  @IsEnum(['public', 'private', 'secret'])
  privacy: 'public' | 'private' | 'secret';
}

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
