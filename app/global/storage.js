var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var axios = require('axios').default;
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.finished);

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
    return true;
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
    return true;
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
    if(!filename) filename = uuid.v4();
    var res = await axios.get(url, {responseType: 'stream'});
    if(res.status == 200) {
      var file = fs.createWriteStream(storagePath(filename));
      res.data.pipe(file);
      await pipeline(file);
      return true;
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