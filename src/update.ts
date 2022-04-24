// credit to zachariapopcorn for this awesome code. it hurts my small brain to use it.

// import config
import './config';
import fetch from 'cross-fetch';
import fs from 'fs';
import util from 'util';
import logger from 'loggis';

const exclusions = [
    'src/config.ts'
];
const api_url = 'https://api.github.com/repos/brandoge91/banPanel/contents'
let fileInfo = "";

function logData(data) {
    logger.info(data);
    fileInfo += `${data}\n`;
}

function isFolder(data) {
    if(data.download_url) {
        return false;
    } else {
        return true;
    }
}

async function getFiles(folder) {
    logData(`\nGetting files for ${folder}`);
    let files;
    try {
        let res = await fetch(`${api_url}/${folder}`);
        files = await res.json();
    } catch(e) {
        throw e;
    }
    for(let i = 0; i < files.length; i++) {
        if(isFolder(files[i])) {
            try {
                // @ts-ignore
                await fs.mkdir(files[i].path, {recursive: true});
                await getFiles(files[i].path);
            } catch(e) {
                throw e;
            }
        } else {
            let name = files[i].path;
            if(!exclusions.find(v => v === name)) {
                try {
                    logData(`Writing file ${files[i].path}`);
                    let res = await fetch(files[i].download_url);
                    let fileContent = res.body;
                    // @ts-ignore
                    await fs.writeFile(files[i].path, fileContent);
                } catch(e) {
                    throw e;
                }
            } else {
                logData(`Skipped file ${files[i].path}`);
            }
        }
    }
}

export async function update() {
    getFiles("/").then(() => {
        logData("Successfully updated bot files");
        // @ts-ignore
        fs.writeFile('updateLog.txt', fileInfo).catch();
    }).catch(e => {
        logData(`Oops! There was an error while attempting to update the bot files: ${e}`);
        // @ts-ignore
        fs.writeFile('updateLog.txt', fileInfo).catch();
    }); 
}

