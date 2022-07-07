import pino from 'pino-http';

import config from './config';

export const httpLogger = pino({
	autoLogging: true,
	level: config.LOG_LEVEL,
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			hideObject: true,
		},
	},
});

export const logger = httpLogger.logger;
