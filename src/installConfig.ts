import { DotenvAzure } from "dotenv-azure";
import { mkdirSync, existsSync, writeFileSync } from "fs";

const azr: DotenvAzure = new DotenvAzure({
    connectionString: process.env.AZURE_APP_CONFIGURATION_CONNECTION_STRING
});

const { parsed } = await azr.config();

if (!existsSync("conf")) mkdirSync("conf");

if (!existsSync("conf/config.json")) {
    writeFileSync("conf/config.json", Buffer.from(parsed["botConfig"]?.toString() as string).toString("utf-8"));
}

if (!existsSync("conf/nodes.json")) {
    writeFileSync("conf/nodes.json", Buffer.from(parsed["nodeList"]?.toString() as string).toString("utf-8"));
}

if (!existsSync("conf/levels.json")) {
    writeFileSync("conf/levels.json", Buffer.from(parsed["levelData"]?.toString() as string).toString("utf-8"));
}

export { };