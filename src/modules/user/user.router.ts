import { Router } from "express";

import * as handler from "./user.handler";

const userRouter = Router();

userRouter.route("/register").post(handler.createUser);
userRouter.route("/login").post();

export default userRouter;
