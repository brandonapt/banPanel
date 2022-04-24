import mongoose, { model, connect } from "mongoose";
const { Schema } = mongoose;
import { getIdFromUsername, getUsernameFromId } from "noblox.js";
const hi = 'd'

mongoose.connect('mongodb://localhost:27017/banPanel').catch(console.error);
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
export { findUser, findUserViaName, findBannedUsers, banUserViaId, unbanUserViaId, createInitialSiteUser, createSiteUser };
