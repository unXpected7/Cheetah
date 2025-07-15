import { ColorLog } from "../../helpers";
import { User } from "../../entity/users";
import { IOType } from "@App/config";
import { Not } from "typeorm";

interface ILeft {
  userId: number;
}

const onLeft = async (IO: IOType, data: ILeft) => {
  try {
    const user = await User.findOne(data.userId);
    if (user) {
      User.update(user.id, { socketId: null }).then(async () => {
        const online = await User.count({
          where: {
            socketId: Not("null"),
          },
        });
        IO.emit("online", { online });
        console.log(`${online} users online`);
      });
      console.log(`${ColorLog.FgCyan} ${user.nickname} has left`);
      IO.emit("writing", {
        msg: "",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default onLeft;
