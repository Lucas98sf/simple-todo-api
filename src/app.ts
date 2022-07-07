import 'express-async-errors';

import cors from 'cors';
import express, { Router } from 'express';

import { errorHandler } from '@/errors';
import { httpLogger } from '@/logger';
import userRouter from '@/modules/user/user.router';

const app = express();

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const router = Router();
router.use('/user', userRouter);

app.use('/api/v1', router);

app.use(errorHandler);

export default app;
