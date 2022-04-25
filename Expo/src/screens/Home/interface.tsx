interface Sample {
  msg: string;
  data: Datum[];
  success: boolean;
}

export interface Datum {
  id: number;
  message: string;
  attachment?: string;
  userId: number;
  replyId?: number;
  updated_at: string;
  created_at: string;
  reply?: Reply;
  user: User;
}

export interface Reply {
  id: number;
  message: string;
  attachment?: string;
  userId: number;
  replyId?: number;
  updated_at: string;
  created_at: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  socketId: string;
  password: string;
  updated_at: string;
  created_at: string;
  avatar: string;
}

export default interface ISample extends Sample {}
