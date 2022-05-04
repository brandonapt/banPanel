import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import logger from "loggis";
import path, { resolve } from "path";
import { promisify } from "util";

export async function update(isDevBranch: boolean) {
    let out
    if (isDevBranch) {
    try {
        const { stdout, stderr } = await exec('git pull origin dev');
        out = stdout;
        logger.info(stdout)
        logger.error(stderr)
    } catch (error) {
        logger.error(error);
        return false;
    }
    return true && process.exit();
} else {
    try {
        const { stdout, stderr } = await exec('git pull origin master'); 
        out = stdout;
        logger.info(stdout)
        logger.error(stderr)
    } catch (error) {
        logger.error(error);
        return false;
    }
    return true && process.exit();
    }
}
 