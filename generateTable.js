const fs = require("fs");
const { getClientCredentialsGrant, findUserIdOrUsername, findBeatmapsetId, getBeatmap, sleep, getUser } = require('./helpers');

// generate table
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
                console.log(`api username: ${user.username}`);
                await sleep(250);

                tableRow += `::{ flag=${user.country_code} }:: [${user.username}](https://osu.ppy.sh/users/${user.id})`;
            } else if (element.includes('https://osu.ppy.sh/beatmapsets/')) {
                const beatmap = await getBeatmap(token, findBeatmapsetId(element));
                console.log(`api metadata: ${beatmap.artist} - ${beatmap.title}`);
                await sleep(250);

                tableRow += `[${beatmap.artist} - ${beatmap.title}](https://osu.ppy.sh/beatmapsets/${beatmap.id})`;
            } else {
                console.log(`input text: ${element}`);
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

generate();