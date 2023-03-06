const fs = require("fs");
const secret = require("./secret.json");
const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate() {
    const buffer = fs.readFileSync('twinTrials.csv');
    const csv = buffer.toString();

    if (!csv) {
        console.log(`couldn't read csv`);
    }

    const data = csv.split('\r\n');

    let table = '';

    for (const unsplitRow of data) {
        const row = unsplitRow.split(',');

        const teamName = row[0];

        let output = `| ${teamName} | `;

        const user1 = await getUser(row[1].substring(25, row[1].length));
        await sleep(500);
        const user2 = await getUser(row[2].substring(25, row[2].length));
        await sleep(500);

        output += `::{{ flag=${user1.country} }}:: [${user1.username}](https://osu.ppy.sh/users/${user1.user_id}), ::{{ flag=${user2.country} }}:: [${user2.username}](https://osu.ppy.sh/users/${user2.user_id}) | *TBD* |`;

        output += '\n';
        table += output;
    }

    fs.writeFile('table.txt', table, (error) => {
        if (error) throw err;
    });

    console.log('done');
}

async function getUser(id) {
    const url = `https://osu.ppy.sh/api/get_user?k=${secret.token}&u=${id}`;
    const res = await axios.get(url);

    console.log(id);
    console.log(res.data[0].username);

    return res.data[0];
}

generate();