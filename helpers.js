const config = require("./config.json");
const axios = require("axios");
const querystring = require('querystring');

// get client credentials
async function getClientCredentialsGrant() {
    const postData = querystring.stringify({
        grant_type: 'client_credentials',
        client_id: config.id,
        client_secret: config.secret,
        scope: 'public',
    });

    const options = {
        method: 'post',
        url: 'https://osu.ppy.sh/oauth/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: postData,
    };

    try {
        const res = await axios(options);

        return res.data;
    } catch (error) {
        return { error };
    }
}

// get user
async function getUser(token, osuId) {
    const options = {
        method: 'GET',
        url: `https://osu.ppy.sh/api/v2/users/${osuId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const res = await axios(options);

        return res.data;
    } catch (error) {
        return { error };
    }
}

// get beatmap
async function getBeatmap(token, setId) {
    const options = {
        method: 'GET',
        url: `https://osu.ppy.sh/api/v2/beatmapsets/${setId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const res = await axios(options);

        return res.data;
    }
     catch (error) {
        return { error };
    }
}

// find beatmapset id
function findBeatmapsetId(url) {
    const indexStart = url.indexOf('beatmapsets/') + 'beatmapsets/'.length;
    const indexEnd = url.indexOf('#');
    let bmId = '';

    if (indexEnd !== -1) {
        bmId = url.slice(indexStart, indexEnd);
    } else {
        bmId = url.slice(indexStart);
    }

    return parseInt(bmId, 10);
}

// find user id (or username)
function findUserIdOrUsername(url) {
    const indexStart = url.indexOf('users/') + 'users/'.length;
    const indexEnd = url.indexOf(url.length);
    let idOrUsername = '';

    if (indexEnd !== -1) {
        idOrUsername = url.slice(indexStart, indexEnd);
    } else {
        idOrUsername = url.slice(indexStart);
    }

    const osuId = parseInt(idOrUsername, 10);

    if (isNaN(parseInt)) return idOrUsername;
    else return osuId;
}

// sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    getClientCredentialsGrant,
    sleep,
    getUser,
    getBeatmap,
    findUserIdOrUsername,
    findBeatmapsetId,
};