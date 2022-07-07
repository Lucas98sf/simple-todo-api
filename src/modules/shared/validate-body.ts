import type { NextFunction, Request, Response } from 'express';
import Joi, { SchemaLike, ValidationErrorItem, ValidationResult } from 'joi';

export const validateBody =
	(schema: SchemaLike) => (req: Request, _res: Response, next: NextFunction) => {
		const joiSchema = Joi.compile(schema);
		const { error }: ValidationResult<typeof schema> = joiSchema.validate(req.body, {
			abortEarly: false,
			convert: true,
		});

		if (error) {
			error.message = error.details.map((detail: ValidationErrorItem) => detail.message).join(', ');

			throw error;
		}

		// Object.assign(req, value);
		return next();
	};
