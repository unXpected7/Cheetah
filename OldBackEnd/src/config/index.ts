import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket, Server } from "socket.io";

export const port = 3333;
export const host = "0.0.0.0";
export interface SocketType
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {}
export interface IOType
  extends Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {}
