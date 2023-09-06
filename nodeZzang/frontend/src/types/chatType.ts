export interface ChatRoom {
  _id: string;
  title: string;
  password: string;
  maxMembers: number;
}

export interface ChatRoomData {
  title: string;
  password: string;
  maxMembers: string;
}


export interface MessageProps {
  message: {
    userId: string;
    nickname: string;
    profileUrl?: string;
    message: string;
    createdAt: string;
  };
  isCurrentUser: boolean;
}

export interface ChatMessage {
  userId: string;
  nickname: string;
  message: string;
  createdAt: string;
}