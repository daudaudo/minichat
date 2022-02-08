require('dotenv').config();
const fs = require('fs');
const path = require('path');
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.finished);
const browserify = require('browserify');
var minifyStream = require('minify-stream')

const basePath = path.dirname(__dirname);
const resourcePath = path.join(basePath, 'resource/js');
const publicPath = path.join(basePath, process.env.FOLDER_COMPLIE_JS ?? 'public/js');

async function complie() {
  if (fs.existsSync(publicPath))
    fs.rmSync(publicPath, {
      recursive: true
    });
  fs.mkdirSync(publicPath);

  for(let file of fs.readdirSync(resourcePath)) {
    var filePath = path.join(resourcePath, file);
    var fileStream = fs.createWriteStream(path.join(publicPath, file));
    browserify(filePath).bundle().pipe(minifyStream({ sourceMap: false })).pipe(fileStream);
    await pipeline(fileStream);
  }

  console.info('Complie file js successfully!');
  process.exit(0);
}

complie();