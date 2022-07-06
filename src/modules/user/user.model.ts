import bcrypt from 'bcryptjs';
import Joi from 'joi';
import mongoose, { Document, Schema, Types } from 'mongoose';

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
		methods: {
			hashPassword: async function (password: string) {
				const salt = await bcrypt.genSalt();
				const hashedPassword = await bcrypt.hash(password, salt);

				return hashedPassword;
			},
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

	email: Joi.string().email(),
}).required();

interface UserDocument extends User, Document {
	hashPassword?(password: string): Promise<string>;
}

UserSchema.pre<UserDocument>('save', async function (next) {
	if (this.isModified('password') || this.isNew) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const hashedPassword = await this.hashPassword!(this.password);
		this.password = hashedPassword;
	}

	return next();
});

const UserModel = mongoose.model<User>('User', UserSchema);

export { User, UserDocument, UserInput, userInputValidation, UserModel, UserWithId };
