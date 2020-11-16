const { readdirSync } = require('fs');
for (const file of readdirSync(__dirname)) require(`./${file}`);