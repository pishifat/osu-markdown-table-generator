const fs = require("fs");
const secret = require("../secret.json");
const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate() {
    const buffer = fs.readFileSync('news.csv');
    const csv = buffer.toString();

    if (!csv) {
        console.log(`couldn't read csv`);
    }

    const data = csv.split('\r\n');

    let table = '';

    for (const id of data) {
        await sleep(1000);
        const user = await getUser(id);
        table += `![${user.country} flag](/wiki/shared/flag/${user.country}.gif) [${user.username}](https://osu.ppy.sh/users/${user.user_id})`;
        table += '\n';
    }

    fs.writeFile('table.txt', table, (error) => {
        if (error) throw err;
    });

    console.log('done');
}

async function getUser(id) {
    const url = `https://osu.ppy.sh/api/get_user?k=${secret.token}&u=${id}`;
    const res = await axios.get(url);

    console.log(res.data[0].username);

    return res.data[0];
}

generate();