(await import("dotenv")).config();
import Bridge from "discord-cross-hosting";
import { TLSSocket } from "tls";
import { IS_DEV } from "./utils/constants.js";
import { logger } from "./utils/logger.js";

const server: Bridge.Bridge = new Bridge.Bridge({
    token: process.env.DISCORD_TOKEN,
    port: Number(process.env.PORT),
    authToken: process.env.AUTH_TOKEN,
    totalMachines: 1,
    tls: true,
    options: {
        pskCallback: (_: TLSSocket, identity: string) => {
            if (identity === process.env.IDENTITY) return Buffer.from(process.env.PASSWORD);
        },
        ciphers: "PSK"
    }
});

server.on("debug", (msg: string) => {
    if (IS_DEV) logger.debug(msg);
});

server.on("ready", (addr: string) => {
    logger.info(`Bridge server started at ${addr}.`);
});

await server.start();