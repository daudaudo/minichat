var fs = require('fs');
var path = require('path');

var basePath = path.dirname(__dirname);

try {
  fs.symlinkSync(path.join(basePath, 'storage/app/public'), path.join(basePath, 'public/storage'), 'dir');
  process.exit(0);
} catch(err) {
  console.error(err);
  process.exit(1);
}
