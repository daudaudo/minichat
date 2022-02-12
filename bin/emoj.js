const fs = require('fs');
const path = require('path');
const util = require('util');

const basePath = path.dirname(__dirname);
const resourcePath = path.join(basePath, 'public/images/emoj');

var arr = [];

for(let file of fs.readdirSync(resourcePath)) {
    arr.push({
        name: file.split('.')[0],
        img: `/images/emoj/${file}`
    });
}

console.log(arr);
process.exit(0);