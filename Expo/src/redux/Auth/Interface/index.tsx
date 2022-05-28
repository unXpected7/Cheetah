interface RootObject {
  email: string;
  avatar: string;
  nickname: string;
  password: string;
  socketId?: string;
  id: number;
  updated_at: string;
  created_at: string;
  isLogin: boolean;
}
  
  export default interface IAuth extends RootObject {}