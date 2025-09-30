import { IOType } from "@App/config";
import { ColorLog } from "../../helpers";
import { User } from "../../entity/users";

interface IWriting {
  userId: number;
}

const onCancelWriting = async (IO: IOType, data: IWriting) => {
  try {
    const { userId } = data;
    const user = await User.findOne(userId);
    if (user) {
      console.log(`${ColorLog.FgCyan} ${user.nickname} is cancel writing...`);
    }
    IO.emit("writing", {
      msg: "",
    });
  } catch (error) {
    console.log(error);
  }
};

export default onCancelWriting;
