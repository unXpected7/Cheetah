import "reflect-metadata";
import express from "express";
import { port } from "./config";
import { createConnection } from "typeorm";
import { err404, invalidJson, logger } from "./middleware";
import { ColorLog } from "./helpers";
import Routers from "./controllers";
import cors from "cors";
const app = express();

createConnection().then(async () => {
  app.use(express.json());
  app.use(cors());
  app.use(logger);
  app.use(invalidJson);
  app.use("/", Routers);
  app.use("*", err404);
  app.listen(port, () => {
    console.log(
      `Server running on port ${ColorLog.FgGreen}http://127.0.0.1:${port}`
    );
  });
});
