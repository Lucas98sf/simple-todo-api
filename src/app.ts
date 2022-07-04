import "express-async-errors";

import cors from "cors";
import express, { Router } from "express";

import { errorHandler } from "@/modules/shared/errors";
import { httpLogger } from "@/modules/shared/logger";
import userRouter from "@/modules/user/user.router";

const app = express();

app.use(httpLogger);
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const router = Router();
router.use("/user", userRouter);
app.use("/api/v1", router);

app.use(errorHandler);

export default app;
