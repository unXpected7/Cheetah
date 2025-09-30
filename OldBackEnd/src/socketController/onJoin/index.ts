import { SocketType, IOType } from "@App/config";
import { ColorLog } from "../../helpers";
import { User } from "../../entity/users";
import { Not } from "typeorm";

interface IJoin {
  userId: number;
}

const onJoin = async (socket: SocketType, IO: IOType, data?: IJoin) => {
  try {
    const user = await User.findOne(data.userId);
    if (user) {
      console.log(`${ColorLog.FgCyan} ${user.nickname} has joined`);
      User.update(user.id, { socketId: socket.id }).then( async () => {
        const online = await User.count({
          where: {
            socketId: Not("null"),
          },
        });
        IO.emit("online", { online });
        console.log(`${online} users online`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export default onJoin;
