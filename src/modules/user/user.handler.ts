import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import type { User } from './user.model';
import * as service from './user.service';

export async function createUser(req: Request, res: Response) {
	const createdUser = await service.createUser(req.body as User);

	return res.status(httpStatus.CREATED).json(createdUser);
}

export async function findUsers(req: Request, res: Response) {
	const { id, email } = req.query;
	const userList = await service.findUsers(id as string, email as string);

	return res.json(userList);
}

export async function updateUser(req: Request, res: Response) {
	const userId = req.params.id as string;
	const updatedUser = await service.updateUser(userId, req.body as User);

	return res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response) {
	const userId = req.params.id as string;
	await service.deleteUser(userId);

	return res.status(httpStatus.NO_CONTENT).json();
}
