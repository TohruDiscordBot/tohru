(await import("dotenv")).config();
import { connect, set } from "mongoose";
import { logger } from "../utils/logger.js";

set("strictQuery", true);

try {
    await connect(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_DB_NAME,
        retryReads: true,
        retryWrites: true
    });
    logger.info("Successfully connected to MongoDB instance.");
} catch (e) {
    logger.error(`Failed to set up a connection to MongoDB instance at URL ${process.env.MONGODB_URL}.`);
    logger.error(e);
}

export { };