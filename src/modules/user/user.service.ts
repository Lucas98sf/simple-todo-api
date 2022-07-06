import httpStatus from "http-status";
import { isValidObjectId, Types } from "mongoose";

import { AppError } from "../shared/errors";
import { User, UserModel, UserWithId } from "./user.model";

const validateObjectId = async (id: string): Promise<Types.ObjectId> => {
	if (!isValidObjectId(id))
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid id format");

	const userId = new Types.ObjectId(id);

	const userIdNotFound = !(await UserModel.exists({ _id: userId }));
	if (userIdNotFound)
		throw new AppError(
			httpStatus.PRECONDITION_FAILED,
			`User with the id '${id}' does not exist in the database`
		);

	return userId;
};

export const createUser = async (userData: User): Promise<User> => {
	const email = userData.email;
	const userEmailAlreadyExists = await UserModel.exists({ email });

	if (userEmailAlreadyExists)
		throw new AppError(
			httpStatus.BAD_REQUEST,
			`User with the email '${email}' already exists in the database`
		);

	return await UserModel.create(userData);
};

export const findUsers = async (
	id?: string,
	email?: string
): Promise<User[]> => {
	const query: Partial<UserWithId> = {};
	if (id) query._id = await validateObjectId(id);
	if (email) query.email = email;

	return await UserModel.find(query);
};

export const updateUser = async (
	userId: string,
	userData: Partial<User>
): Promise<User> => {
	const userObjectId = await validateObjectId(userId);

	const updatedUser = await UserModel.findByIdAndUpdate(
		userObjectId,
		userData,
		{
			new: true,
		}
	);

	return updatedUser as User;
};

export const deleteUser = async (userId: string): Promise<void> => {
	const userObjectId = await validateObjectId(userId);

	await UserModel.deleteOne({ _id: userObjectId });
};
