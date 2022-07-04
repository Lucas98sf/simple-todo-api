import { connect, connection, ConnectOptions } from "mongoose";

import { logger } from "./logger";

export const connectToDatabase = async (mongoUri: string): Promise<void> => {
	connection
		.once("open", () => logger.debug("Connected to MongoDB!"))
		.on("error", (err) => logger.error("[MongoDB Error]: ", err))
		.on("close", () => logger.warn("Connection to MongoDB closed!"));

	await connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	} as ConnectOptions);
};
