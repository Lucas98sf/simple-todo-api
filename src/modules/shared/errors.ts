import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export class AppError extends Error {
	constructor(
		override message: string,
		override stack = "",
		public readonly statusCode: number
	) {
		super(message);
		this.statusCode = statusCode;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	req.log.error(err);

	if (err instanceof AppError) {
		return res.status(err.statusCode).send(err.message);
	}

	if (err instanceof mongoose.Error.ValidationError) {
		return res.status(422).send(err.message);
	}

	req.log.error("Unhandled error, exiting...");
	process.exit(1);
};
