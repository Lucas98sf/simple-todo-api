import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';
import mongoose from 'mongoose';

export class AppError extends Error {
	constructor(public readonly statusCode: number, override message: string, override stack = '') {
		super(message);
		this.statusCode = statusCode;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
	req.log.error(err);

	const message = { message: err.message };

	if (err instanceof AppError) {
		return res.status(err.statusCode).json(message);
	}

	if (err instanceof Joi.ValidationError) {
		return res.status(httpStatus.UNPROCESSABLE_ENTITY).json(message);
	}

	if (err instanceof mongoose.Error.ValidationError) {
		return res.status(httpStatus.BAD_REQUEST).json(message);
	}

	req.log.error('Unhandled error, exiting...');
	// eslint-disable-next-line no-magic-numbers
	process.exit(1);
};
