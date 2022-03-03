import "reflect-metadata";
import express from "express";
import { host, port } from "./config";
import { createConnection } from "typeorm";
import { err404, invalidJson, logger } from "./middleware";
import { ColorLog } from "./helpers";
import Routers from "./controllers";
import cors from "cors";
const app = express();
import { createServer } from "http";
import { Server } from "socket.io";
import {
  onCancelWriting,
  onChat,
  onJoin,
  onLeft,
  onWriting,
} from "./socketController";

createConnection().then(async () => {
  app.use(express.json());
  app.use(cors());
  app.use(logger);
  app.use(invalidJson);
  app.use("/", Routers);
  app.use("*", err404);
  const httpServer = createServer(app);
  const io = new Server(httpServer);
  io.on("connection", async (socket) => {
    socket.on("join", (data) => onJoin(socket, io, data));
    socket.on("chat", (data) => onChat(io, data));
    socket.on("writing", (data) => onWriting(io, data));
    socket.on("cancelWriting", (data) => onCancelWriting(io, data));
    socket.on("left", (data) => onLeft(io, data));
  });
  httpServer.listen(port, host, () => {
    console.log(`Server running on ${ColorLog.FgGreen} http://${host}:${port}`);
  });
});
