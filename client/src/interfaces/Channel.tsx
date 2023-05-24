export interface Member {
  nickname: string;
  avatar: string;
}

export interface DirectMessage {
  channelId: string;
  members: Member[];
  isChannel: boolean;
}

export interface Channel {
  channelId: string;
  name: string;
  topic: string;
  avatar: string;
  privacy: 'public' | 'private' | 'secret';
  isChannel: boolean;
  memberLimit: number;
  membersCount?: number;
  owner?: Member;
  admins?: Member[];
  members?: Member[];
  mutes?: {
    player: Member[];
  };
  bans?: {
    player: Member[];
  };
}
