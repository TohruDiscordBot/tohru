import { client } from "../../client.js";
import { logger } from "../../utils/logger.js";
import { updateCommands } from "../../utils/updateCommands.js";

client.on("ready", () => {
    updateCommands();
    logger.info(`[READY] Logged in as ${client.user.tag}.`);
});