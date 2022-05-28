import Axios from "axios";
import config from "../config";
const { host, ep } = config;

export type IType = "POST" | "GET" | "PUT" | "DELETE";

export interface Ihydrate {
  success: boolean;
  msg: string;
}

interface IHandler {
  path: string;
  type: IType;
  data?: any;
  isFormData?: boolean;
  form?: any;
  isNotLogin?: boolean;
}

interface IGlobalResponse {
  success: boolean;
  msg: string;
  data: any;
}

const GlobalHandler = (payload: IHandler): Promise<IGlobalResponse> => {
  const baseURL = host + ep + (payload?.path ?? "");
  __DEV__ &&
    console.log(`⚡ Requesting::${payload.path} :`, {
      ...payload,
      path: baseURL,
    });
  const _handler = async (payload: IHandler): Promise<IGlobalResponse> => {
    try {
      const res = await Axios({
        url: baseURL,
        headers: {
          "Content-Type": payload?.isFormData
            ? "multipart/form-data"
            : "application/json",
        },
        method: payload.type,
        data: payload?.isFormData
          ? payload?.form
          : payload?.isNotLogin
          ? payload?.data
          : {
              payload: JSON.stringify(payload?.data),
              method: payload?.type,
              key: payload?.path,
            },
      });
      const data: IGlobalResponse = res?.data;
      __DEV__ && console.log(`🌈 Response::${payload.path} :`, data);
      return data;
    } catch (error: any) {
      const data: IGlobalResponse | undefined = error.response?.data;
      __DEV__ &&
        console.log(`💀❗❗ Response::${payload.path}`, {
          msg: data?.msg ?? error?.message,
          path: baseURL,
        });

      const formatedError: IGlobalResponse = {
        data: data?.data,
        msg: data?.msg ?? error?.message,
        success: false,
      };
      return formatedError;
    }
  };
  return _handler(payload);
};

export default GlobalHandler;
