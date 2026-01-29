const fs = require('fs');

const [id, name] = process.argv.slice(2);

if (!id || !name) {
    console.log('Usage: node generateContentUsagePermissionsTable.js <id> <name>');
    process.exit(1);
}

function extractNameFromLine(line) {
    const parts = line.split(' | ');
    if (parts.length >= 2) {
        const nameMatch = parts[1].match(/\[([^\]]+)\]/);
        if (nameMatch) {
            return nameMatch[1];
        }
    }
    return '';
}

function getSortKey(name) {
    // remove backslash for sorting
    const cleanName = name.replace(/^\\/, '').toLowerCase();
    const firstChar = cleanName.charAt(0);

    // sort order: * -> - -> 0 -> : -> A
    if (firstChar === '*') {
        return '0' + cleanName;
    } else if (firstChar === '-') {
        return '1' + cleanName;
    } else if (/[0-9]/.test(firstChar)) {
        return '2' + cleanName;
    } else if (firstChar === ':') {
        return '3' + cleanName;
    } else {
        return '4' + cleanName;
    }
}

const url = `https://osu.ppy.sh/beatmaps/artists/${id}`;
const newLine = `| [![][FA]](${url}) | [${name}](${url}) | ![][true] |`;

// read existing artists (don't ask why it's in output despite being input...)
const existingLines = fs.readFileSync('./output/contentUsagePermissions.md', 'utf-8')
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
fs.writeFileSync('./output/contentUsagePermissions.md', sortedLines.join('\n'));
console.log(`Added "${name}" to contentUsagePermissions.md (${sortedLines.length} total artists)`);
