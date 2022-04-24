import express from "express";
import path from "path";
import db from 'block.db'
import logger from "loggis";
const Passport = require('discord-passport')
var session = require('express-session')
import 'express-zip' 
import fetch from 'cross-fetch'
const cookieParser = require('cookie-parser');
import cors from 'cors';
const { URLSearchParams } = require('url');
import { place, url, clientId, clientSecret, roleId, guildId, sessionSecret, adminRoleId } from "./config";
import noblox, { getIdFromUsername, getPlayerInfo, getPlayerThumbnail } from "noblox.js";
import { createInitialSiteUser, unbanUserViaId } from "./database";
import { generateLuaScript, generateRandomString, getVersion } from "./utils";
import fs from "fs";
// import the database
const API_ENDPOINT = 'https://discord.com/api/v8'
const CLIENT_ID = clientId;

const CLIENT_SECRET = clientSecret;
const REDIRECT_URI = 'http://localhost:3000';
const { findUser, findUserViaName, findBannedUsers, banUserViaId } = require("./database");
var emojis = [
    '📋', '🎉', '🎂', '📆', '✔️', '📃', '👍', '➕', '📢', '🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇'
];
const randomString = generateRandomString();

var passport

async function initPassport(code, ending) {
     passport = new Passport({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI + ending,
        scope: ["identify", "guilds", "guilds.members.read"]
    })
    await passport.open();
    const data = {
        access_token: passport.token,
        refresh_token: passport.refresh_token,
        expires_in: passport.expires_in,
    }
    setTimeout(async () => { // After our token expires, get a new one.
        await passport.refresh(); // Updates these values with the new ones.
    }, passport.expires_in);
    return passport
}

 
async function checkPermissions(passport, id) {
    const raw = await fetch(API_ENDPOINT + `/users/@me/guilds/${guildId}/member`, {
        headers: {
            'Authorization': 'Bearer ' + passport
        }
    })

    const json = await raw.json()
    const roles = json.roles
    for (const i in roles) {
        if (roles[i] === roleId || roles[i] === adminRoleId) { 
            return true
        }
    } 
    return false
}

async function checkAdminPermissions(passport, id) {
    const raw = await fetch(API_ENDPOINT + `/users/@me/guilds/${guildId}/member`, {
        headers: {
            'Authorization': 'Bearer ' + passport
        }
    })

    const json = await raw.json()
    const roles = json.roles
    for (const i in roles) {
        if (roles[i] === adminRoleId) { 
            return true
        }
    } 
    return false
}

const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use(session({ secret: sessionSecret, cookie: { maxAge: 60000 }}))
app.use(express.static(path.join(__dirname, 'web/assets')))

app.get('/', async (req, res) => {

    if (req.query.code) {
        const pas = await initPassport(req.query.code, '/')
    }
    if (passport == null) {
        return res.redirect('https://discord.com/api/oauth2/authorize?client_id=962427659437105182&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=code&scope=identify%20guilds%20guilds.members.read')
    }
    // @ts-ignore
    // @ts-ignore
    if (req.session.hasPerms == null) {
    const permissions = await checkPermissions(passport.token, passport.user.id)
    if (permissions == false) {
        // @ts-ignore
        req.session.hasPerms = false
        return res.sendFile(path.join(__dirname, 'web/405.html'))
    } else if (permissions == true) {
        // @ts-ignore  
        req.session.hasPerms = true
        res.sendFile(path.join(__dirname, 'web/index.html'))
        
    }
    res.cookie('.bpasecurity', passport.token, { maxAge: passport.expires_in })
    if (!permissions) { 
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    }
    // @ts-ignore
} else if (req.session.hasPerms == false) {
    return res.sendFile(path.join(__dirname, 'web/405.html'))

    // @ts-ignore
} else if (req.session.hasPerms == true) {
    res.sendFile(path.join(__dirname, 'web/index.html'))
}

})

app.listen(3000, () => {
    logger.info('Server is listening on port 3000')
})

app.get('/bans', async (req, res) => {
    
    if (req.query.code) {
        const pas = await initPassport(req.query.code, '/bans')
    }
    if (passport == null) {
        return res.redirect('https://discord.com/api/oauth2/authorize?client_id=962427659437105182&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fbans&response_type=code&scope=identify%20guilds.members.read%20guilds')
    }
    // @ts-ignore
    // @ts-ignore
    if (req.session.hasPerms == null) {
    const permissions = await checkPermissions(passport.token, passport.user.id)
    if (permissions == false) {
        // @ts-ignore
        req.session.hasPerms = false
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    } else if (permissions == true) {
        // @ts-ignore  
        req.session.hasPerms = true
        res.sendFile(path.join(__dirname, 'web/bans.html'))
        
    }
    res.cookie('.bpasecurity', passport.token, { maxAge: passport.expires_in })
    if (!permissions) { 
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    }
    // @ts-ignore
} else if (req.session.hasPerms == false) {
    return res.sendFile(path.join(__dirname, 'web/405.html'))

    // @ts-ignore
} else if (req.session.hasPerms == true) {
    res.sendFile(path.join(__dirname, 'web/bans.html'))
}
})

app.get('/info', async (req, res) => { 
    if (req.query.code) {
        const pas = await initPassport(req.query.code, '/info')
    }
    if (passport == null) {
        return res.redirect('https://discord.com/api/oauth2/authorize?client_id=962427659437105182&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Finfo&response_type=code&scope=identify%20guilds.members.read%20guilds')
    }
    // @ts-ignore
    // @ts-ignore
    if (req.session.hasPerms == null) {
    const permissions = await checkPermissions(passport.token, passport.user.id)
    if (permissions == false) {
        // @ts-ignore
        req.session.hasPerms = false
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    } else if (permissions == true) {
        // @ts-ignore  
        req.session.hasPerms = true
        res.sendFile(path.join(__dirname, 'web/info.html'))
        
    }
    res.cookie('.bpasecurity', passport.token, { maxAge: passport.expires_in })
    if (!permissions) { 
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    }
    // @ts-ignore
} else if (req.session.hasPerms == false) {
    return res.sendFile(path.join(__dirname, 'web/405.html'))

    // @ts-ignore
} else if (req.session.hasPerms == true) {
    res.sendFile(path.join(__dirname, 'web/info.html'))
}
})

app.get('/settings', async (req, res) => { 
    if (req.query.code) {
        const pas = await initPassport(req.query.code, '/settings')
    }
    if (passport == null) {
        return res.redirect('https://discord.com/api/oauth2/authorize?client_id=962427659437105182&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fsettings&response_type=code&scope=identify%20guilds.members.read%20guilds')
    }
    // @ts-ignore
    // @ts-ignore
    if (req.session.hasAdminPerms == null) {
    const permissions = await checkAdminPermissions(passport.token, passport.user.id)
    if (permissions == false) {
        // @ts-ignore
        req.session.hasAdminPerms = false
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    } else if (permissions == true) {
        // @ts-ignore  
        req.session.hasAdminPerms = true
        res.sendFile(path.join(__dirname, 'web/settings.html'))
        
    }
    res.cookie('.bpasecurity', passport.token, { maxAge: passport.expires_in })
    if (!permissions) { 
        return res.sendFile(path.join(__dirname, 'web/405.html'))

    }
    // @ts-ignore
} else if (req.session.hasPerms == false) {
    return res.sendFile(path.join(__dirname, 'web/405.html'))

    // @ts-ignore
} else if (req.session.hasPerms == true) {
    res.sendFile(path.join(__dirname, 'web/settings.html'))
}
})



app.get('/api/users/:username', async (req, res) => {
    const { username } = req.params
    try {
        const id = await getIdFromUsername(username)
        const info = await getPlayerInfo(id)
        res.json({info: info, success: true})
    } catch (e) {
        res.json({ error: e.message, success: false })
    }
})
app.get('/api/thumbnail/:username', async (req, res) => {
    const { username } = req.params
    const id = await getIdFromUsername(username)
    const info = await getPlayerThumbnail(id, "60x60", "png",true,"headshot")
    res.json(info) 
})
app.get('/api/thumbnail/big/:username', async (req, res) => {
    const { username } = req.params
    const id = await getIdFromUsername(username)
    const info = await getPlayerThumbnail(id, "150x150", "png",true,"headshot")
    res.json(info) 
})
app.get('/api/getinfo/name/:username', async (req, res) => {
    const { username } = req.params
    const info = await findUserViaName(username)
    res.json(info)
});
app.get('/api/getinfo/id/:username', async (req, res) => {
    const { username } = req.params
    const info = await findUser(username)
    res.json(info)
});

app.get('/api/validate/:username', async (req, res) => {
    const { username } = req.params
    let plr
    try {
    plr = await getIdFromUsername(username)
    } catch (e) {
        return res.json({ error: e.message, success: false })
    }
    if (!plr) return res.json({ success: false })
    if (plr) return res.json({ success: true })
});


//create a post endpoint for banning
app.post('/api/ban/:id', async (req, res) => {
    const { id } = req.params
    const { reason, bannedBy } = req.body
    try {
        const info = await banUserViaId(id, reason, bannedBy)
        res.json({ success: true })
    } catch (error) {
        logger.error(error)
        res.json({ success: false, error })
    }
})

app.post('/api/ban/user/:id', async (req, res) => {
    let { id } = req.params
    const main = await noblox.getIdFromUsername(id)
    const { reason, bannedBy } = req.body
    try {
        const info = await banUserViaId(main, reason, bannedBy)
        res.json({ success: true })
    } catch (error) {
        logger.error(error)
        res.json({ success: false, error })
    }
})

app.post('/api/unban/:id', async (req, res) => {
    const { id } = req.params
    try {
        const info = await unbanUserViaId(Number(id))
        res.json({ success: true })
    } catch (error) {
        logger.error(error)
        res.json({ success: false, error })
    }
})

app.get('/api/bans', async (req, res) => {
    const info = await findBannedUsers()
    res.json(info)
})
app.post('/api/players/send', async (req, res) => {
    const { players } = req.body
    await db.set('players', players)
    return res.json({ success: true })
})

app.get('/api/players/get', async (req, res) => {
    const info = await db.get('players')
    res.json(info)
}) 

app.get('/api/verification/start/:username', async (req, res) => {
    const { username } = req.params
    try {
    var result = ""
    for (var i = 0; i < 8; i++) {
        var randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        result = result + randomEmoji;
      }
    db.set(`${username}_verification`, result)
    } catch(e) {
        logger.error(e)
        return res.json({ success: false, error: e.message })
    }
    res.json({ success: true, code: result })
}) 

app.get('/api/verification/check/:username', async (req, res) => {
    const { username } = req.params
    const code = await db.get(`${username}_verification`)
    if (!code) return res.json({ success: false })
    let info
    let doesHaveCode
    try {
        let id = await getIdFromUsername(username)
        info = await noblox.getPlayerInfo(id)
        if (info.blurb.includes(code)) {
            doesHaveCode = true
        } else {
            doesHaveCode = false
        }
    } catch (e) {
        logger.error(e)
        return res.json({ success: false, error: e.message })
    }
    if (doesHaveCode) {
        
        return res.json({ success: true })
    } else {
        return res.json({ success: false })
    }
})
app.post('/api/creation/create', async (req, res) => {
    try {
        createInitialSiteUser(req.body.userId)
    } catch (e) {
        return res.json({ success: false, error: e.message })
    }

})

app.get('/api/discord/link', async (req, res) => {
    res.redirect(url)
})
app.get('/api/loader/download', async (req, res) => {
    const folderPath = __dirname+'/files';
    const protocol = req.protocol;
    const host = req.hostname;
    const port = 3000
    const url = req.originalUrl;
    const str = generateLuaScript(protocol + '://' + host)
    const fileName = 'loader.lua'
    fs.writeFileSync(path.join(__dirname, '/files/', fileName), str)
    res.download(__dirname  + '/files/' + fileName)
})

app.get('/api/update/check', async (req, res) => {
    const raw = await fetch('https://raw.githubusercontent.com/brandoge91/banPanel/master/src/files/version.txt')
    const currentVersion = await raw.text()
    const localVersion = getVersion()
    if (currentVersion > localVersion) {
        return res.json({ success: true, update: true })
    } else {
        return res.json({ success: true, update: false })
    }
})

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'web/404.html'))
  })

