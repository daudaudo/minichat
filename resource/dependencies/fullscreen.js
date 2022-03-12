class FullScreen {
  /**
   * 
   * @param {HTMLElement} el 
   * @param {Object} options
   */
  constructor(el, options) {
    this.fullscreenable = el;
    this.options = options;
    this.registerEvent();
  }

  registerEvent() {
    document.addEventListener('fullscreenchange', () => this.fullscreenchangeHandler(), false);
    document.addEventListener('mozfullscreenchange', () => this.fullscreenchangeHandler(), false);
    document.addEventListener('MSFullscreenChange', () => this.fullscreenchangeHandler(), false);
    document.addEventListener('webkitfullscreenchange', () => this.fullscreenchangeHandler(), false);
  }

  fullscreenchangeHandler() {
    if (window.innerHeight == screen.height) {
      if(this.options.enter)
        this.options.enter();
    } else {
      if(this.options.exit)
        this.options.exit();
    }
  }

  open() {
    if (this.fullscreenable.requestFullscreen) {
      this.fullscreenable.requestFullscreen();
    } else if (this.fullscreenable.webkitRequestFullscreen) {
      this.fullscreenable.webkitRequestFullscreen();
    } else if (this.fullscreenable.msRequestFullscreen) {
      this.fullscreenable.msRequestFullscreen();
    }
  }

  close() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  toggleScreen() {
    if (window.innerHeight == screen.height) {
      this.close();
    } else {
      this.open();
    }
  }
}

module.exports = FullScreen;
