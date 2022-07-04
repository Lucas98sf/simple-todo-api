import type { Request, Response } from "express";

import type { User } from "./user.model";
import * as service from "./user.service";

export async function createUser(
	req: Request,
	res: Response
): Promise<Response<User>> {
	const user = await service.createUser(req.body as User);

	return res.json(user);
}
