const $ = require('jquery');

class Dropzone {
  /**
   * 
   * @param {String} target 
   * @param {Object} options 
   */
  constructor(target, options) {
    this.dropable = $(target);
    this.init();
    this.files = [];
    if(options.preview) {
      this.previewable = $(options.preview);
    }
  }

  init() {
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
            if(file) {
              this.files.push(file);
              let type = file.type;
              if(type.includes('image')) {
                this.previewable.append(`
                  <div class="p-2">
                    <div class="preview-item">
                      <img dragable="false" class="" src="${URL.createObjectURL(file)}">
                    </div> 
                  </div>
                `);
              }
            }
          }
        }
      } else {
        for (let i = 0; i < e.originalEvent.dataTransfer.files.length; i++) {
          var file = e.originalEvent.dataTransfer.items[i].getAsFile();
          if(file) this.files.push(file);
        }
      }
      console.log(this.files);
    });
  }
}

module.exports = Dropzone;