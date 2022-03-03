import { IOType } from "@App/config";
import { ColorLog } from "../../helpers";
import { User } from "../../entity/users";

interface IWriting {
  userId: number;
}

const onWriting = async (IO: IOType, data: IWriting) => {
  try {
    const { userId } = data;
    const user = await User.findOne(userId);
    if (user) {
      IO.emit("writing", {
        msg: `${user.nickname} is writing...`,
      });
      console.log(`${ColorLog.FgCyan} ${user.nickname} is writing...`);
    }
  } catch (error) {
    console.log(error);
  }
};

export default onWriting;
