import { getAllFilesSync } from "get-all-files";
import { join } from "path";

export async function loader(...path: string[]): Promise<void> {
    for (const pathname of path) {
        for (const filename of getAllFilesSync(pathname)) {
            if (!filename.endsWith(".js")) continue;
            const fileDir: string = join(import.meta.url, "..", "..", "..", filename);
            await import(fileDir);
        }
    }
}