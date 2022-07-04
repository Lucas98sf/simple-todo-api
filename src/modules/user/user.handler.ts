import type { Request, Response } from "express";

import { User, UserModel } from "./user.model";

export async function createUser(
	req: Request,
	res: Response
): Promise<Response<User>> {
	const userData: User = req.body as User;
	const user = await UserModel.create(userData);
	return res.json(user);
}
