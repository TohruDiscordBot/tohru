import { client } from "../../client.js";
import { ENV } from "../../utils/constants.js";
import { logger } from "../../utils/logger.js";

if (ENV !== "prod")
    client.on("debug", (msg: string) => {
        logger.debug(msg)
    });