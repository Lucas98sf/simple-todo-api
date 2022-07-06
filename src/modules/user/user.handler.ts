import type { Request, Response } from "express";
import httpStatus from "http-status";

import type { User, UserWithId } from "./user.model";
import * as service from "./user.service";

export async function createUser(
	req: Request,
	res: Response
): Promise<Response<User>> {
	const createdUser = await service.createUser(req.body as User);

	return res.status(httpStatus.CREATED).json(createdUser);
}

export async function findUsers(
	req: Request,
	res: Response
): Promise<Response<UserWithId>> {
	const { id, email } = req.query;
	const user = await service.findUsers(id as string, email as string);

	return res.json(user);
}

export async function updateUser(
	req: Request,
	res: Response
): Promise<Response<User>> {
	const userId = req.params.id;
	const updatedUser = await service.updateUser(userId, req.body as User);

	return res.status(httpStatus.OK).json(updatedUser);
}

export async function deleteUser(
	req: Request,
	res: Response
): Promise<Response<User>> {
	const userId = req.params.id;
	await service.deleteUser(userId);

	return res.status(httpStatus.OK).json({ acknowledged: true });
}
