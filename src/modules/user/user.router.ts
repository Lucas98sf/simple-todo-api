import { Router } from "express";

import { validateBody } from "../shared/validate-body";
import * as handler from "./user.handler";
import { UserInput } from "./user.model";

const userRouter = Router();

userRouter.route("/register").post(validateBody(UserInput), handler.createUser);
userRouter.route("/login").post();

export default userRouter;
