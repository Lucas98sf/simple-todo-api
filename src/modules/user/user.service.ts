import httpStatus from "http-status";

import { AppError } from "../shared/errors";
import { User, UserModel } from "./user.model";

const verifyIfUserExists = async ({
	email,
	username,
}: Partial<User>): Promise<void> => {
	if (email) {
		const emailExists = await UserModel.exists({ email });
		if (emailExists)
			throw new AppError(
				httpStatus.CONFLICT,
				`User with the email '${email}' already exists`
			);
	}

	if (username) {
		const usernameExists = await UserModel.exists({ username });
		if (usernameExists)
			throw new AppError(
				httpStatus.CONFLICT,
				`User with the username '${username}' already exists`
			);
	}
};

export const createUser = async (userData: User) => {
	await verifyIfUserExists(userData);

	const user = await UserModel.create(userData);

	return user;
};
