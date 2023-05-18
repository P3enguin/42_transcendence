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

export class KickMemberDto {
  @IsString()
  channelId: string;

  @IsString()
  memberNickname: string;
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

export class UnbanMemberDto {
  @IsString()
  channelId: string;

  @IsString()
  memberNickname: string;
}

export class MuteMemberDto {
  @IsString()
  channelId: string;

  @IsString()
  memberNickname: string;

  @IsInt()
  @IsOptional()
  duration?: number;
}

export class UnmuteMemberDto {
  @IsString()
  channelId: string;

  @IsString()
  memberNickname: string;
}
