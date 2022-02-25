const $ = require('jquery');
const filesize = require('filesize');
const mimetype = require('mime-types');
const uuid = require('uuid');

class Dropzone {
  /**
   * 
   * @param {String} target 
   * @param {Object} options 
   */
  constructor(target, options) {
    this.dropable = $(target);
    this.files = {};
    this.options = options;
    this.init();
  }

  init() {
    if(this.options.preview) {
      this.previewable = $(this.options.preview);
    }
    this.dropable.addClass('dropzone');
    this.dragenter = $(`
      <div class="dragenter flex flex-col justify-center items-center">
        <h3 class="text-xl text-slate-700 font-bold -z-10">Drop files here</h3>
      </div>
    `);
    this.dropable.append(this.dragenter);

    document.addEventListener('drop', function(e) {
      e.preventDefault();
    }, false);

    document.addEventListener('dragover', function(e) {
      e.preventDefault();
    }, false);

    this.dropable.on('dragenter', e => {
      e.preventDefault();
      this.dropable.addClass('active');
    });

    this.dropable.on('dragleave', '.dragenter', e => {
      this.dropable.removeClass('active');
    });

    this.dropable.on('drop', e => {
      e.preventDefault();
      this.dropable.removeClass('active');
      if (e.originalEvent.dataTransfer.items) {
        for (let i = 0; i < e.originalEvent.dataTransfer.items.length; i++) {
          if (e.originalEvent.dataTransfer.items[i].kind === 'file') {
            var file = e.originalEvent.dataTransfer.items[i].getAsFile();
            this.addFile(file);
          }
        }
      } else {
        for (let i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
          var file = e.originalEvent.dataTransfer.items[i].getAsFile();
          this.addFile(file);
        }
      }
      console.log(this.files);
    });
  }

  /**
   * 
   * @param {File} file 
   */
  addFile(file) {
    if(!file || !file.size) return;
    var fileId = uuid.v4();
    var ext = mimetype.extension(file.type);

    if(!ext) return;

    this.files[fileId] = {
      file: file,
      ext: ext,
    };

    this.addPreviewImageItem(fileId);
  }

  /**
   * 
   * @param {String} fileId 
   */

  addPreviewImageItem(fileId) {
    var file = this.files[fileId].file;
    var ext = this.files[fileId].ext;

    var previewItem = $(`
      <div class="p-2">
        <div class="preview-item">
          <div class="preview-info">
            <div class="flex items-center justify-center flex-col w-full h-full font-medium text-white">
              <p class="text-sm truncate w-full text-center p-1">${file.name}</p>
              <p class="text-sm truncate w-full text-center p-1">${filesize(file.size)}</p>
            </div>
          </div>
          <div class="preview-content">
            ${this.renderFileTemplate(file, ext)}
          </div>
          <span class="preview-close"></span>
        </div> 
      </div>
    `);

    this.previewable.append(previewItem);
    previewItem.find('.preview-close').on('click touch', e=>{
      previewItem.remove();
      delete this.files[fileId];
    });
  }

  /**
   * 
   * @param {File} file 
   * @param {String} ext 
   */

  renderFileTemplate(file, ext) {
    var template = ``;
    switch(ext) {
      case 'png':
      case 'jpg':
      case 'jpeg':
        template = `<img draggable="false" class="w-full h-full object-cover" src="${URL.createObjectURL(file)}">`;
        break;
      case 'json':
        template = `<img draggable="false" class="w-full h-full object-cover" src="/images/filetypes/json-file.png">`;
        break;
      default:
        template = `<img draggable="false" class="w-full h-full object-contain" src="/images/filetypes/file.png">`;
        break;
    }
    return template;
  }

  clear() {
    this.files = {};
    this.previewable.empty();
  }

  upload() {
    if(this.options.uploadUrl) {
      
    }
  }
}

module.exports = Dropzone;
