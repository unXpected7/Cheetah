import { User } from "../../../entity/users";
import { Chat } from "../../../entity/chats";
import { Router } from "express";
import {  Resp } from "../../../helpers";

const chatRouter = Router();

/*
Get All Chats
*/
chatRouter.get("/v1/chat/page/:id", async (req, res) => {
  try {
    const page = isNaN(Number(req.params?.id)) ? 1 : Number(req.params?.id);
    let take = 100;
    let skip = take * page - take;
    const chats = await Chat.find({
      order: {
        id: "DESC",
      },
      take,
      skip,
      relations: ["reply"],
    });
    res.json(Resp.success("Get Chats Success", chats));
  } catch (error) {
    res.status(500).json(Resp.error(error.message));
  }
});

export default chatRouter;
