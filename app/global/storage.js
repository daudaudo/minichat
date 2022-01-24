var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var axios = require('axios').default;
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.finished);
var mime = require('mime-types');

/**
 * @param {String} filename
 * @returns {String}
 */
function storagePath(filename) {
  var target = path.dirname(path.dirname(__dirname));
  target = path.join(target, 'storage/app');
  target = path.join(target, filename);
  return target;
}

/**
 * 
 * @param {String} src 
 * @param {String} filename 
 */
function saveSync(src, filename) {
  if(!filename) filename = uuid.v4();
  try {
    fs.cpSync(src, storagePath(filename));
    fs.unlinkSync(src);
    return filename;
  } catch (err) {
    throw err;
  }
}

/**
 * 
 * @param {String} content 
 * @param {String} filename 
 */
function putSync(content, filename) {
  if(!filename) filename = uuid.v4();
  try {
    fs.writeFileSync(storagePath(filename), content);
    return filename;
  } catch (err) {
    throw err;
  }
}

/**
 * 
 * @param {String} url 
 * @param {String} filename 
 */
async function putFromUrl(url, filename)
{
  try {
    var res = await axios.get(url, {responseType: 'stream'});
    if(!filename) filename = `${uuid.v4()}.${mime.extension(res.headers['content-type'])}`;
    if(res.status == 200) {
      var file = fs.createWriteStream(storagePath(filename));
      res.data.pipe(file);
      await pipeline(file);
      return filename;
    }
    else return false;
  } catch(err) {
    return false;
  }
}

module.exports = {
  storagePath,
  saveSync,
  putSync,
  putFromUrl
};