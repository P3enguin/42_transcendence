import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsOptional()
  key?: string;
}

export class KickMemberDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  memberNickname: string;
}

export class BanMemberDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  memberNickname: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class UnbanMemberDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  memberNickname: string;
}

export class MuteMemberDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  memberNickname: string;

  @IsInt()
  @IsOptional()
  duration?: number;
}

export class UnmuteMemberDto {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  memberNickname: string;
}

export class invitedMember {
  @IsString()
  @IsNotEmpty()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  playerNickname;
}

export class MessageInfo {
  
  @IsString()
  sender: string;

  @IsString()
  senderAvatar: string;

  @IsString()
  time: string;

  @IsString()
  message: string;
}