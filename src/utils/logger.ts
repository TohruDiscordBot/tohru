import { createLogger, Logger, format, transports } from "winston";
import { ENV } from "./constants.js";

const customFormat = format.printf((info) => {
    return `[${new Date().toLocaleString()}] [${info.level.toUpperCase()}]: ${info.message}`;
});

export const logger: Logger = createLogger({
    format: format.combine(
        customFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ dirname: "logs", filename: "info.log", level: "info" }),
        new transports.File({ dirname: "logs", filename: "warn.log", level: "warn" }),
        new transports.File({ dirname: "logs", filename: "error.log", level: "error" }),
        new transports.File({ dirname: "logs", filename: "debug.log", level: "debug", silent: ENV === "prod" })
    ]
});