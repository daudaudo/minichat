const $ = require('jquery');
const mime = require('mime-types');

class FileInput {
  /**
   * 
   * @param {String} id 
   * @param {Object} options 
   */
  constructor(id, options) {
    this.fileInput = $(id);
    this.options = options;
    this.init();
  }

  init() {
    this.fileInput.on('change', () => {
      var files = this.fileInput.prop('files');
      files = this.filterFiles(files);

      if(this.options.change) {
        if(this.options.multiple) {
          this.options.change(files);
        } else {
          this.options.change(files[0]);
        }
      }
    });
  }

  /**
   * 
   * @param {FileList} filelist
   */
  filterFiles(filelist) {
    var files = [];

    for(let i=0; i< filelist.length; i++) {

      var file = filelist.item(i);
      var ext = mime.extension(file.type);
      var validate = true;

      if (this.options.maxSize && file.size < this.options.maxSize) {
        validate = false;
      }

      if (this.options.accept && !this.options.accept.includes(ext)) {
        validate = false;
      }

      if(validate) files.push(file);
    }

    return files;
  }

}

module.exports = FileInput;
