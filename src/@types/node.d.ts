declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			NODE_ENV: 'development' | 'production';
			MONGO_TEST_URI: string;
			MONGO_URI: string;
			JWT_SECRET: string;
			IS_DEV: boolean;
			LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
		}
	}
}

export {};
