var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
var axios = require('axios').default;
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.finished);
var mime = require('mime-types');

class Storage {
  /**
   * 
   * @param {String} folder 
   */
  constructor(folder) {
    this.folder = folder ?? '/';
  }

  storagePath(filename) {
    var target = path.dirname(path.dirname(__dirname));
    target = path.join(target, 'storage/app');
    target = path.join(target, this.folder);
    if(!fs.existsSync(target)) fs.mkdirSync(target);
    target = path.join(target, filename);
    return target;
  }

  storageRelativePath(filename) {
    return path.join(this.folder, filename);
  }

  /**
   * 
   * @param {String} content 
   * @param {String} filename 
   */
  putSync(content, filename) {
    if(!filename) filename = uuid.v4();
    try {
      fs.writeFileSync(this.storagePath(filename), content);
      return this.storageRelativePath(filename);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 
   * @param {String} url 
   * @param {String} filename 
   */
  async putFromUrl(url, filename)
  {
    try {
      var res = await axios.get(url, {responseType: 'stream'});
      if(!filename) filename = `${uuid.v4()}.${mime.extension(res.headers['content-type'])}`;
      if(res.status == 200) {
        var file = fs.createWriteStream(this.storagePath(filename));
        res.data.pipe(file);
        await pipeline(file);
        return this.storageRelativePath(filename);
      }
      else return false;
    } catch(err) {
      return false;
    }
  }

  /**
   * 
   * @param {String} folder 
   * @returns 
   */
  static fromFolder(folder) {
    return new Storage(folder);
  }

  /**
   * 
   * @param {String} relativePath 
   */
  static url(relativePath) {
    if(relativePath.search(/^public\/(.*)/) === 0) 
      return relativePath.replace('public', '/storage');

    return null;
  }

  /**
   * 
   * @param {Object} file 
   */
  upload(file) {
    var ext = mime.extension(file.type);
    var filename = `${uuid.v4()}.${ext}`;
    try {
      fs.cpSync(file.path, this.storagePath(filename));
      fs.unlinkSync(file.path);
      return this.storageRelativePath(filename);
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = Storage;
