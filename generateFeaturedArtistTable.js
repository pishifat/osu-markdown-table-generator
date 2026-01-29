const fs = require('fs');
const axios = require('axios');
const { getClientCredentialsGrant, sleep, getUser } = require('./helpers');

const [userId, artistId] = process.argv.slice(2);

if (!userId || !artistId) {
    console.log('Usage: node generateFeaturedArtistTable.js <userId> <artistId>');
    process.exit(1);
}

async function getArtistName(id) {
    const url = `https://osu.ppy.sh/beatmaps/artists/${id}`;

    try {
        const res = await axios.get(url);
        const html = res.data;

        const match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        return match ? match[1].trim() : null;
    } catch (error) {
        console.error(`Error fetching artist ${id}:`, error.message);
        return null;
    }
}

function extractNameFromLine(line) {
    const match = line.match(/\}:: \[([^\]]+)\]/);
    return match ? match[1] : '';
}

function getSortKey(name) {
    const cleanName = name.replace(/^\\/, '').toLowerCase();
    const firstChar = cleanName.charAt(0);

    if (firstChar === '*') {
        return '0' + cleanName;
    } else if (firstChar === '-') {
        return '1' + cleanName;
    } else if (firstChar === '_') {
        return '2' + cleanName;
    } else if (firstChar === '[') {
        return '3' + cleanName;
    } else if (/[0-9]/.test(firstChar)) {
        return '4' + cleanName;
    } else if (firstChar === ':') {
        return '5' + cleanName;
    } else {
        return '6' + cleanName;
    }
}

function generateTableLine(user, artistName, artistId) {
    const artistUrl = `https://osu.ppy.sh/beatmaps/artists/${artistId}`;
    return `| ::{ flag=${user.country_code} }:: [${user.username}](https://osu.ppy.sh/users/${user.id}) | [${artistName}](${artistUrl}) |`;
}

async function main() {
    const response = await getClientCredentialsGrant();
    const token = response.access_token;

    // get user
    console.log(`Fetching user ${userId}...`);
    const user = await getUser(token, userId);

    if (!user || user.error) {
        console.error('Error fetching user data');
        process.exit(1);
    }

    // get artist
    console.log(`Fetching artist ${artistId}...`);
    const artistName = await getArtistName(artistId);

    if (!artistName) {
        console.error('Error fetching artist data');
        process.exit(1);
    }

    // generate text
    const newLine = generateTableLine(user, artistName, artistId);
    console.log(`Generated: ${newLine}`);

    const existingLines = fs.readFileSync('./output/featuredArtists.md', 'utf-8')
        .split('\n')
        .filter(line => line.trim());

    existingLines.push(newLine);

    // sort
    const sortedLines = existingLines.sort((a, b) => {
        const nameA = getSortKey(extractNameFromLine(a));
        const nameB = getSortKey(extractNameFromLine(b));
        return nameA.localeCompare(nameB);
    });

    // export
    fs.writeFileSync('./output/featuredArtists.md', sortedLines.join('\n'));
    console.log(`Added "${user.username}" (${artistName}) to featuredArtists.md (${sortedLines.length} total)`);
}

main();
