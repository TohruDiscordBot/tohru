import { client } from "../../client.js";
import { IS_DEV } from "../../utils/constants.js";
import { logger } from "../../utils/logger.js";

if (IS_DEV)
    client.on("debug", (msg: string) => {
        logger.debug(`[CLIENT] ` + msg);
    });