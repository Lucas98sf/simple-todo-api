import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "@/config";

export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, config.JWT_SECRET);

	next();
}
