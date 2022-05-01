import mongoose, { model, connect } from "mongoose";
const { Schema } = mongoose;
import { getIdFromUsername, getUsernameFromId } from "noblox.js";
// massive poggers

mongoose.connect('mongodb+srv://brandon:brandon123@cluster0.6oieu.mongodb.net/banel').catch(console.error);
 const User = model("User", new Schema({
    username: String,
    userId: Number,
    banned: Boolean,
    bannedReason: String,
    bannedBy: String,
    expiresOn: Date,
},{ collection: "users" }));
const SiteUser = model("SiteUser", new Schema({ 
    discordId: Number,
    discordTag: String,
    owner: Boolean,
    admin: Boolean,
    robloxId: Number,
    robloxName: String,
},{ collection: "siteusers" }));
const SiteSettings = model("SiteSettings", new Schema({
    groupId: Number,
    clientId: String,
    clientSecret: String,
    guildId: String,
    userRoleId: String,
    adminRoleId: String,
    siteUrl: String,
    setupHasHappened: Boolean,
    verificationProvider: String,
    isDevBranch: Boolean,
},{ collection: "sitesettings" }));


async function getSiteSettings() {
    const settings = await SiteSettings.findOne({});
    if (!settings) {
        const newSettings = new SiteSettings({
            groupId: 0,
            clientId: "",
            clientSecret: "",
            guildId: "",
            userRoleId: "",
            adminRoleId: "",
            siteUrl: "",
            setupHasHappened: false,
            verificationProvider: "Internal",
            isDevBranch: false,
        });
        await newSettings.save();
        return newSettings;
    }
    return settings;
}
async function setGroupId(groupId: Number) {
    const settings = await getSiteSettings();
    settings.groupId = groupId;
    await settings.save();
}
async function setClientId(clientId: String) {
    const settings = await getSiteSettings();
    settings.clientId = clientId;
    await settings.save();
}
async function setClientSecret(clientSecret: String) {
    const settings = await getSiteSettings();
    settings.clientSecret = clientSecret;
    await settings.save();
}
async function setGuildId(guildId: String) {
    const settings = await getSiteSettings();
    settings.guildId = guildId;
    await settings.save();
}
async function setUserRoleId(roleId: String) {
    const settings = await getSiteSettings();
    settings.userRoleId = roleId;
    await settings.save();
}
async function setAdminRoleId(roleId: String) {
    const settings = await getSiteSettings();
    settings.adminRoleId = roleId;
    await settings.save();
}

async function setSiteUrl(url: String) {
    const settings = await getSiteSettings();
    settings.siteUrl = url;
    await settings.save();
}

async function setupHasHappened() {
    const settings = await getSiteSettings();
    settings.setupHasHappened = true;
    await settings.save();
}

async function changeVerificationProvider(provider: String) {
    const settings = await getSiteSettings();
    settings.verificationProvider = provider;
    await settings.save();
}

async function switchBranches(isDevBranch: Boolean) {
    const settings = await getSiteSettings();
    settings.isDevBranch = isDevBranch;
    await settings.save();
}


 async function findUser(userId: Number) {
    const name = await getUsernameFromId(Number(userId));
    let userData = await User.findOne({ userId: userId });
    if(!userData) {
        userData = await User.create({ userId: userId, username: name, banned: false });
    }
    return userData;
}

 async function findUserViaName(username: String) {
    const userId = await getIdFromUsername(username.toString());
    let userData = await User.findOne({ username: username });
    if(!userData) {
        userData = await User.create({ userId: userId, username: username, banned: false });
    }
    return userData;
}


async function findBannedUsers() {
    let userData = await User.find({ banned: true });
    return userData;
}

async function banUserViaId(userId: Number, reason: String, bannedBy: String) {
    const name = await getUsernameFromId(Number(userId));
    let userData = await User.findOne({ userId: userId });
    if(!userData) {
        userData = await User.create({ userId: userId, username: name, banned: false });
    }
    userData.banned = true;
    userData.bannedReason = reason;
    userData.bannedBy = bannedBy;
    userData.save();
    return userData;
}

async function unbanUserViaId(userId: Number) {
    const name = await getUsernameFromId(Number(userId));
    let userData = await User.findOne({ userId: userId });
    if(!userData) {
        userData = await User.create({ userId: userId, username: name, banned: false });
    }
    userData.banned = false;
    userData.bannedReason = null;
    userData.bannedBy = null;
    userData.save();
    return userData;
}

async function createSiteUser(userId: Number, admin: Boolean) {
    const name = await getUsernameFromId(Number(userId));
    let userData = await User.create({ robloxId: userId, username: name, admin: admin, owner: false });
    userData.save();
    return userData;
}

async function createInitialSiteUser(userId: Number) {
    const name = await getUsernameFromId(Number(userId));
    let userData = await User.create({ robloxId: userId, username: name, owner: true });
    userData.save();
    return userData;
}

async function addDiscordToUser(userId: Number, discordId: Number, discordTag: String) {
    const data = await SiteUser.findOne({ robloxId: userId });
    if(!data) {
        throw new Error('Something went wrong. User not found.')
    }
    data.discordId = discordId;
    data.discordTag = discordTag;
}


//export all the functions 
export { findUser, findUserViaName, findBannedUsers, banUserViaId, unbanUserViaId, createInitialSiteUser, createSiteUser, getSiteSettings, setGroupId, setClientId, setClientSecret, setGuildId, setUserRoleId, setAdminRoleId, addDiscordToUser, setSiteUrl, setupHasHappened, switchBranches, changeVerificationProvider };
