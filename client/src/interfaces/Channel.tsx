export interface Member {
  nickname: string;
  avatar: string;
  topic: string;
}

export interface Channel {
  channelId: number;
  name: string;
  topic: string;
  avatar: string;
  owner: Member;
  admins: Member[];
  members: Member[];
  memberLimit: number;
}
