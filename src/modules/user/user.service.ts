import httpStatus from 'http-status';
import { isValidObjectId, Types } from 'mongoose';

import { AppError } from '../../errors';
import { UserDocument, UserInput, UserModel, UserWithId } from './user.model';

const validateObjectId = async (id: string): Promise<Types.ObjectId> => {
	if (!isValidObjectId(id)) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid id format');

	const userId = new Types.ObjectId(id);

	return userId;
};

const ensureUserIdExists = async (userId: Types.ObjectId): Promise<void> => {
	const userIdNotFound = !(await UserModel.exists({ _id: userId }));

	if (userIdNotFound)
		throw new AppError(
			httpStatus.PRECONDITION_FAILED,
			`User with id '${userId.toString()}' does not exist in the database`
		);
};

const ensureNonDuplicateUserData = async (email?: string, username?: string): Promise<void> => {
	if (email) {
		const userEmailAlreadyExists = await UserModel.exists({ email });

		if (userEmailAlreadyExists)
			throw new AppError(
				httpStatus.BAD_REQUEST,
				`User with email '${email}' already exists in the database`
			);
	}

	if (username) {
		const userUsernameAlreadyExists = await UserModel.exists({ username });

		if (userUsernameAlreadyExists)
			throw new AppError(
				httpStatus.BAD_REQUEST,
				`User with username '${username}' already exists in the database`
			);
	}
};

export const createUser = async (userData: UserInput): Promise<UserDocument> => {
	await ensureNonDuplicateUserData(userData.email, userData.username);

	const newUser = await new UserModel(userData).save();

	return newUser;
};

export const findUsers = async (id?: string, email?: string): Promise<UserDocument[]> => {
	const query: Partial<UserWithId> = {};
	if (id) query._id = await validateObjectId(id);
	if (email) query.email = email;

	const users = await UserModel.find(query);

	return users;
};

export const updateUser = async (
	userId: string,
	userData: Partial<UserInput>
): Promise<UserDocument> => {
	const userObjectId = await validateObjectId(userId);
	await ensureUserIdExists(userObjectId);

	if (userData.email) await ensureNonDuplicateUserData(userData.email);
	if (userData.username) await ensureNonDuplicateUserData(undefined, userData.username);

	const updatedUser = await UserModel.findByIdAndUpdate(userObjectId, userData, {
		new: true,
	});

	return updatedUser as UserDocument;
};

export const deleteUser = async (userId: string): Promise<void> => {
	const userObjectId = await validateObjectId(userId);
	await ensureUserIdExists(userObjectId);

	await UserModel.deleteOne({ _id: userObjectId });
};
