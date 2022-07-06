import pino from 'pino-http';

export const httpLogger = pino({
	autoLogging: true,
	level: 'debug',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			hideObject: true,
		},
	},
});

export const logger = httpLogger.logger;
