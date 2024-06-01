# table

`generateTable.js` generates table based on `table.csv` with some osu-specific elements:
- first row is headers
- every element in second column is `:--`
- osu user links are replaced by `[flag] [username]`
- osu beatmap links are replaced by `[artist] - [title]`
- anything else is copied directly

# names list

`generateNames.js` generates list of comma separated usernames with flags based on `names.txt`