const fs = require("fs");
const secret = require("../secret.json");
const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generate() {
    const buffer = fs.readFileSync('triangles.csv');
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

        const mappers = row[1].split(' ');
        const storyboarders = row[2].split(' ');

        const users = [mappers, storyboarders];

        for (const category of users) {
            for (const id of category) {
                await sleep(1000);
                const user = await getUser(id);
                output += `![][flag_${user.country}] [${user.username}](https://osu.ppy.sh/users/${user.user_id}), `;
            }
            output = output.substring(0, output.length - 2);
            output += ' | ';
        }
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

    console.log(res.data[0].username);

    return res.data[0];
}

generate();