import Handler from "../../index";
import React from "react";
import { useToast } from "native-base";
import { Toaster } from "../../../helpers";

interface IPayload {
  email: string;
  nickname: string;
}

const useLogin = () => {
  const [loading, setLoading] = React.useState(false);
  const [Error, setError] = React.useState(false);
  const [Data, setData] = React.useState<Data>();
  const [Msg, setMsg] = React.useState<string>("");
  const toast = useToast();

  const _fetch = async (payload: IPayload) => {
    setLoading(true);
    setError(false);
    setData(undefined);
    const res = await Handler({
      path: "user/check",
      isNotLogin: true,
      data: payload,
      type: "POST",
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

export default useLogin;

interface Data {
  id: number;
  username: string;
  name: string;
  role: string;
  deleted_at?: any;
  created_at: string;
  updated_at: string;
  token: string;
}
