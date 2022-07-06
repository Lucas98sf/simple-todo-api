import bcrypt from 'bcryptjs';

export default async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
}
