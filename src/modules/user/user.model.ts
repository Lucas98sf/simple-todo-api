import Joi from 'joi';
import mongoose, { Document, Schema, Types } from 'mongoose';

import hashPassword from '@/util/hash-password';

type User = {
	username: string;
	email: string;
	password: string;
	todos: Types.ObjectId[];
};

type UserWithId = User & { _id: Types.ObjectId };

const UserSchema = new Schema<User>(
	{
		username: {
			type: String,
			required: true,
			min: 2,
			max: 30,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 8,
			max: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		todos: {
			type: [Schema.Types.ObjectId],
			default: [],
			ref: 'Todo',
		},
	},
	{
		timestamps: {
			createdAt: true,
			updatedAt: true,
		},
	}
);

type UserInput = {
	username: string;
	password: string;
	email: string;
};

const userInputValidation = Joi.object<UserInput>({
	// eslint-disable-next-line no-magic-numbers
	username: Joi.string().alphanum().min(2).max(30),

	// eslint-disable-next-line no-magic-numbers
	password: Joi.string().min(8).max(50),

	email: Joi.string().email().lowercase(),
}).required();

interface UserDocument extends User, Document {
	_update?: Partial<UserInput>;
}

UserSchema.pre<UserDocument>(/save|findOneAndUpdate/, async function (next) {
	if (this._update?.password) this._update.password = await hashPassword(this._update.password);
	else if ((this.isModified && this.isModified('password')) || this.isNew) {
		this.password = await hashPassword(this.password);
	}

	return next();
});

const UserModel = mongoose.model<User>('User', UserSchema);

export { User, UserDocument, UserInput, userInputValidation, UserModel, UserWithId };
