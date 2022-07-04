import jwt from "jsonwebtoken";
import config from "@/config";

export function generateToken(data: string) {
	return jwt.sign(data, config.JWT_SECRET, { expiresIn: "2h" });
}
