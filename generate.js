const fs = require("fs");
const config = require("./config.json");
const axios = require("axios");
const querystring = require('querystring');

async function generate() {
    const buffer = fs.readFileSync('table.csv');
    const csv = buffer.toString();

    if (!csv) {
        console.log(`couldn't read csv`);
    }

    const response = await getClientCredentialsGrant();
    const token = response.access_token;

    const data = csv.split('\r\n');

    let table = '';

    for (let i = 0; i < data.length; i++) {
        const row = data[i].split(',');

        let tableRow = '| ';
        
        for (const element of row) {
            if (element.includes('https://osu.ppy.sh/users/')) {
                const user = await getUser(token, findUserIdOrUsername(element));
                console.log(user.username);
                await sleep(250);

                tableRow += `::{ flag=${user.country_code} }:: [${user.username}](https://osu.ppy.sh/users/${user.id})`;
            } else if (element.includes('https://osu.ppy.sh/beatmapsets/')) {
                const beatmap = await getBeatmap(token, findBeatmapsetId(element));
                console.log(`${beatmap.artist} - ${beatmap.title}`);
                await sleep(250);

                tableRow += `[${beatmap.artist} - ${beatmap.title}](https://osu.ppy.sh/beatmapsets/${beatmap.id})`;
            } else {
                console.log(element);
                tableRow += element;
            }

            tableRow += ' | ';
        }

        // for table structure
        table += tableRow.slice(0,-1);
        table += '\n';

        if (i == 0) {
            tableRow = '| ';

            for (const element of row) {
                tableRow += ':-- | ';
            }

            table += tableRow.slice(0,-1);
            table += '\n';
        }
    }

    fs.writeFile('table.md', table, (error) => {
        if (error) throw err;
    });

    console.log('\n---\n\ndone');
}

// helper functions

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

generate();