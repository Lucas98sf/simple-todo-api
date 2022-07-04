import app from "@/app";
import config from "@/config";
import { connectToDatabase } from "@/modules/shared/db";
import { logger } from "@/modules/shared/logger";

const bootstrap = async () => {
	if (!config.MONGO_URI)
		throw new Error("Please specify a MongoDB URI in .env file");

	await connectToDatabase(config.MONGO_URI);

	app.listen(config.PORT);
	logger.debug(`Server is running on port ${config.PORT}`);
};
bootstrap().catch((err) => logger.error(err));

process.on("unhandledRejection", (reason: Error) => {
	reason.message ??= JSON.stringify(reason);
	logger.debug(`Unhandled Rejection: ${reason.message}`);

	throw new Error(reason.message);
	// process.exit(1)
});
