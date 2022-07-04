import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import config from "@/config";

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers["authorization"];
	const TOKEN_INDEX = 1;
	const token = authHeader?.split(" ").at(TOKEN_INDEX);

	if (!token) return res.sendStatus(httpStatus.UNAUTHORIZED);

	jwt.verify(token, config.JWT_SECRET);

	next();
}
