import express from "express";
import { port } from "./config";

const app = express();

app.get("/", (_, res) => {
  res.json({
    message: "Hello World 🐆",
  });
});

app.listen(port, () => {
  console.log(`Server running on port http://127.0.0.1:${port}`);
});
