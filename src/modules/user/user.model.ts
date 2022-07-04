import bcrypt from "bcryptjs";
import mongoose, { Document, Schema, Types } from "mongoose";

export type User = {
	name: string;
	email: string;
	password: string;
	todos: Types.ObjectId[];
};

export interface UserDocument extends User, Document {
	hashPassword(password: string): Promise<string>;
}

const UserSchema = new Schema<User>(
	{
		name: {
			type: String,
			required: true,
			min: 3,
			max: 40,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		todos: {
			type: [Schema.Types.ObjectId],
			default: [],
			ref: "Todo",
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

UserSchema.pre<UserDocument>("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		const hashedPassword = await this.hashPassword(this.password);
		this.password = hashedPassword;
	}

	return next();
});

export const UserModel = mongoose.model<User>("User", UserSchema);
