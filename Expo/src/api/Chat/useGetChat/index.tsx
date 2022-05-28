import Handler from "../../index";
import React from "react";
import { useToast } from "native-base";
import { Toaster } from "../../../helpers";

interface IPayload {
  page: number;
}

const useGetChat = () => {
  const [loading, setLoading] = React.useState(false);
  const [Error, setError] = React.useState(false);
  const [Data, setData] = React.useState<IGetChat[]>();
  const [Msg, setMsg] = React.useState<string>("");
  const toast = useToast();

  const _fetch = async (payload: IPayload) => {
    setLoading(true);
    setError(false);
    setData(undefined);
    const res: RootObject = await Handler({
      path: "chat/page/" + payload.page,
      type: "GET",
    });
    const { data, msg, success } = res;
    setLoading(false);
    setData(data);
    if (success) {
      setError(false);
      setMsg(msg);
    } else {
      setError(true);
      setMsg(msg);
      Toaster({
        text: msg,
        toast,
        type: "danger",
      });
    }
    return res;
  };
  return {
    loading,
    Error,
    Data,
    Msg,
    _fetch,
  };
};

export default useGetChat;

export interface RootObject {
  msg: string;
  data: IGetChat[];
  success: boolean;
}

export interface IGetChat {
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
  avatar: string;
  updated_at: string;
  created_at: string;
}
