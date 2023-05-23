export interface Member {
  nickname: string;
  avatar: string;
}

export interface DirectMessage {
  channelId: string;
  members: Member[];
}
