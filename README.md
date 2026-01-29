# `generateGenericTable.js`

`generateTable.js` generates table based on `./input/table.csv` with some osu-specific elements:
- first row is headers (optional)
- every element in second column is `:--` (only if headers row exists)
- osu user links are replaced by `[flag] [username]`
- osu beatmap links are replaced by `[artist] - [title]`
- anything else is copied directly

# `generateGenericNames.js`

`generateNames.js` generates list of comma separated usernames with flags based on `./input/names.txt`

# `generateContentUsagePermissionsTable.js`

`generateContentUsagePermissionsTable.js` generates table used on https://osu.ppy.sh/wiki/en/Rules/Content_usage_permissions#allowed

# `generateFeaturedArtistTable.js`

`generateFeaturedArtistTable.js` generates table used on https://osu.ppy.sh/wiki/en/People/Featured_Artists#featured-artists-with-osu%21-accounts