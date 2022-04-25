import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import logger from "loggis";
import path, { resolve } from "path";
import { promisify } from "util";

export async function update() {
    let out
    try {
        const { stdout, stderr } = await exec('git pull');
        out = stdout;
    } catch (error) {
        logger.error(error);
        return false;
    }
    await writeFileSync(path.join(__dirname + 'updateLog.txt'), out);
    return true;
}
