import { IOType } from "@App/config";
import { User } from "../../entity/users";
import { Chat } from "../../entity/chats";
import { ColorLog } from "../../helpers";

interface IChat {
  message: string;
  attachment?: string;
  userId: number;
  replyId?: number;
}

const onChat = async (IO: IOType, data: IChat) => {
  try {
    const { message, userId, attachment, replyId } = data;
    const user = await User.findOne(userId);
    if (user) {
      const newchat = await Chat.create({
        message,
        attachment,
        userId,
        replyId,
      });
      const { id } = await Chat.save(newchat);

      const chat = await Chat.findOne({
        where: { id },
        relations: ["reply"],
      });

      IO.emit("chat", chat);
      IO.emit("writing", {
        msg: "",
      });
      console.log(`${ColorLog.FgCyan} messageSend by `, user.nickname);
    }
  } catch (error) {
    console.log(error);
  }
};

export default onChat;
