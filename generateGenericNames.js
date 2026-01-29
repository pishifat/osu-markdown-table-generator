const fs = require("fs");
const { getClientCredentialsGrant, sleep, getUser } = require('./helpers');

async function generate() {
    const buffer = fs.readFileSync('./input/names.txt');
    const txt = buffer.toString();

    if (!txt) {
        console.log(`couldn't read txt`);
    }

    const response = await getClientCredentialsGrant();
    const token = response.access_token;

    const data = txt.split('\r\n');

    let output = '';

    for (let i = 0; i < data.length; i++) {
        console.log(`input username: ${data[i]}`);
        const user = await getUser(token, data[i]);
        console.log(`api username: ${user.username}`);
        output += `::{ flag=${user.country_code} }:: [${user.username}](https://osu.ppy.sh/users/${user.id}), `;
        await sleep(250);  
    }

    fs.writeFile('./output/names.txt', output, (error) => {
        if (error) throw err;
    });

    console.log('\n---\n\ndone');
}

generate();