import { IToastProps } from "native-base";
import { ToasterComponent } from "../components";

interface IToast {
  show: (props: IToastProps) => any;
  close: (id: any) => void;
  closeAll: () => void;
  isActive: (id: any) => boolean;
}
export const Toaster = ({
  toast,
  type,
  text,
  duration,
}: {
  toast: IToast;
  type: "success" | "danger" | "warning";
  text: string;
  duration?: number;
}) => {
  toast.show({
    id: Math.random() + text + "-" + type,
    render: () => <ToasterComponent type={type} text={text} />,
    duration: duration ?? 3000,
  });
};

const DiceBearHost = "https://avatars.dicebear.com/api/";
export type IDBType =
  | "adventurer"
  | "adventurer-neutral"
  | "avataaars"
  | "big-ears"
  | "big-ears-neutral"
  | "big-smile"
  | "croodles"
  | "croodles-neutral"
  | "identicon"
  | "micah"
  | "miniavs"
  | "open-peeps"
  | "personas"
  | "pixel-art"
  | "pixel-art-neutral";

export const generateRandomAvatar = (type: IDBType) => {
  const randomString = Math.random() * 99999999999999;
  return `${DiceBearHost}${type}/${randomString}.png`;
};

export const DBTypeList: IDBType[] = [
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "big-ears",
  "big-ears-neutral",
  "big-smile",
  "croodles",
  "croodles-neutral",
  "identicon",
  "micah",
  "miniavs",
  "open-peeps",
  "personas",
  "pixel-art",
  "pixel-art-neutral",
];
