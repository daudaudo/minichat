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
      this.dropable.addClass('active');
    });

    this.dropable.on('dragleave', '.dragenter', e => {
      this.dropable.removeClass('active');
    });

    this.dropable.on('drop', e => {
      e.preventDefault();
      this.dropable.removeClass('active');
    });
  }
}

module.exports = Dropzone;