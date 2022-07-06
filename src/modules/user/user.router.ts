import { Router } from 'express';

import { validateBody } from '../shared/validate-body';
import * as handler from './user.handler';
import { userInputValidation } from './user.model';

const userRouter = Router();

// userRouter.route("/login").post();

const requiredUserInput = userInputValidation.options({ presence: 'required' });
userRouter.route('/').post(validateBody(requiredUserInput), handler.createUser);

userRouter.route('/').get(handler.findUsers);

userRouter.route('/:id').put(validateBody(userInputValidation), handler.updateUser);

userRouter.route('/:id').delete(handler.deleteUser);

export default userRouter;
