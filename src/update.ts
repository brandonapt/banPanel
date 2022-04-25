import { exec } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";
import { promisify } from "util";

exec('git pull');