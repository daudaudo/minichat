var fs = require('fs');
var path = require('path');
var uuid = require('uuid');

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
function save(src, filename) {
  if(!filename) filename = uuid.v4();
  try {
    fs.cpSync(src, storagePath(filename));
    fs.unlinkSync(src);
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  save,
  storagePath
};