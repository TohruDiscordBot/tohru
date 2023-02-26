import { DotenvAzure } from "dotenv-azure";
import { mkdirSync, existsSync, writeFileSync } from "fs";

const CONN_STR: string = "Endpoint=https://tohru.azconfig.io;Id=78t8-l0-s0:gwHLW5Lj3dD4g+C6b5iT;Secret=QMJQJVYYAmfctY1Hwe9fk0cVaO0d2MULKjcojogE9DE=";

const azr: DotenvAzure = new DotenvAzure({
    connectionString: CONN_STR
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