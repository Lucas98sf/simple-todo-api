import dotenv from 'dotenv';
dotenv.config();

const { PORT, NODE_ENV, MONGO_TEST_URI, MONGO_URI, JWT_SECRET, LOG_LEVEL } = process.env;

const config = {
	PORT: parseInt(PORT ?? '3000', 10),
	NODE_ENV: NODE_ENV ?? 'development',
	MONGO_URI,
	MONGO_TEST_URI,
	JWT_SECRET,
	IS_DEV: NODE_ENV !== 'production',
	LOG_LEVEL: LOG_LEVEL ?? 'silent',
};

export default config;
