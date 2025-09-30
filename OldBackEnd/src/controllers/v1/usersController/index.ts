import { User } from "../../../entity/users";
// import { Chat } from "../../entity/chats";
import { Router } from "express";
import {
  CheckPassword,
  GenerateAvatar,
  GenerateSalt,
  Hash,
  joiID,
  Resp,
  validate,
} from "../../../helpers";
import { isUnique, VLogin, VRegister } from "./Validation";
import { Like } from "typeorm";

const userRouter = Router();

/*Login Controller*/
interface ILogin {
  email: string;
  password: string;
}
userRouter.post("/v1/login", async (req, res) => {
  try {
    const body = req.body as ILogin;
    validate(VLogin, body);
    const { email, password } = body;
    const user = await User.findOne({ where: { email } });

    //check if email exist in database
    if (!user) {
      return res.status(422).json(Resp.error("User not found"));
    }

    //check if password match with database hash
    if (
      !CheckPassword({
        password,
        database_hash: user.password,
      })
    ) {
      return res.status(422).json(Resp.error("Password not match"));
    }

    //Login Success
    return res.json(Resp.success("Login success", user));
  } catch (error) {
    res.status(400).json(Resp.error(error.message));
  }
});

/*Register Controller*/
interface IRegister {
  nickname: string;
  email: string;
  password: string;
}
userRouter.post("/v1/register", async (req, res) => {
  try {
    const body = req.body as IRegister;
    validate(VRegister, body);

    const avatar = GenerateAvatar({
      nickname: body.nickname,
    });

    const user = await User.save(
      await User.create({
        ...body,
        password: Hash(body.password, GenerateSalt()),
        avatar
      })
    );
    //Register Success
    return res.json(Resp.success("Register success", user));
  } catch (error) {
    res.status(400).json(Resp.error(isUnique(error.message)));
  }
});

/*Get All Users*/
userRouter.get("/v1/user/all", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(Resp.success("Get Users Success", users));
  } catch (error) {
    res.status(400).json(Resp.error(error.message));
  }
});

/*Get All Users*/
userRouter.get("/v1/user/all", async (req, res) => {
  try {
    const users = await User.find();
    return res.json(Resp.success("Get Users Success", users));
  } catch (error) {
    res.status(500).json(Resp.error(error.message));
  }
});

/*Find One User*/
userRouter.get("/v1/user/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) return res.status(422).json(Resp.error("Tag should not be empty"));
    const user = await User.findOne({ where: { nickname: id } });
    if (!user) {
      return res.status(422).json(Resp.error("User not found"));
    }
    return res.json(Resp.success("Get User Success", user));
  } catch (error) {
    res.status(500).json(Resp.error(error.message));
  }
});

/*Delete One User*/
userRouter.delete("/v1/user/:id", async (req, res) => {
  try {
    validate(joiID, req.params);
    const { id } = req.params;
    const user = await User.findOne(id);
    if (!user) {
      return res.status(422).json(Resp.error("User not found"));
    }
    User.remove(user);
    return res.json(Resp.success("User Deleted", { user, deleted: 1 }));
  } catch (error) {
    res.status(500).json(Resp.error(error.message));
  }
});

/*Update User*/
interface IUpdate {
  nickname: string;
  email: string;
  password: string;
}
userRouter.patch("/v1/user/:id", async (req, res) => {
  try {
    const body = req.body as IUpdate;
    const { id } = req.params;
    validate(joiID, req.params);
    validate(VRegister, body);

    const user = await User.findOne(id);
    //check if user exist in database
    if (!user) {
      return res.status(422).json(Resp.error("User not found"));
    }

    //check if password match with database hash
    if (
      !CheckPassword({
        password: body.password,
        database_hash: user.password,
      })
    ) {
      return res.status(422).json(Resp.error("Password not match"));
    }

    User.update(id, {
      email: body.email,
      nickname: body.nickname,
    });

    //Update Success
    return res.json(
      Resp.success("Update success", {
        id,
        email: body.email,
        nickname: body.nickname,
      })
    );
  } catch (error) {
    res.status(400).json(Resp.error(isUnique(error.message)));
  }
});

/*Get User By Tag*/
userRouter.get("/v1/user/tag/:id", async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) return res.status(422).json(Resp.error("Tag should not be empty"));
    if (!id.includes("@"))
      return res
        .status(422)
        .json(Resp.error("Invalid tag, tag should start with @"));

    const tag = id.split("@")[1];

    const user = await User.find({
      where: { nickname: Like(`${tag}%`) },
      select: ["nickname"],
      take: 10,
    });

    return res.json(
      Resp.success(
        "get tags",
        user.map((u) => "@" + u.nickname)
      )
    );
  } catch (error) {
    res.status(500).json(Resp.error(error.message));
  }
});

export default userRouter;
