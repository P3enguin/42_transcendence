export interface Member {
  id?: number;
  nickname: string;
  avatar: string;
  firstname?: string;
  lastname?: string;
}

export interface Channel {
  channelId: string;
  name: string;
  topic: string;
  avatar: string;
  privacy: 'public' | 'private' | 'secret';
  key?: string;
  isChannel: boolean;
  memberLimit: number;
  membersCount?: number;
  owner?: Member;
  admins?: Member[];
  members?: Member[];
  mutes?: {
    player: Member;
  }[];
  bans?: {
    player: Member;
  }[];
}
