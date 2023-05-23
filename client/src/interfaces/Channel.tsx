export interface Member {
  nickname: string;
  avatar: string;
}

export interface Channel {
  channelId: string;
  name: string;
  topic: string;
  avatar: string;
  privacy: 'public' | 'private' | 'secret';
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
