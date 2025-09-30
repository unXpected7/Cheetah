interface Iparam {
  nickname: string;
  type?:
    | "male"
    | "female"
    | "human"
    | "identicon"
    | "initials"
    | "bottts"
    | "avataaars"
    | "jdenticon";
}

const GenerateAvatar = ({ nickname, type = "human" }: Iparam) => {
  return `https://avatars.dicebear.com/api/${type}/${nickname}.svg`;
};

export default GenerateAvatar;
