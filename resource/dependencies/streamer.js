class Streamer {
  /**
   * 
   * @param {MediaStream} stream 
   * @param {Object} options 
   */
  constructor(stream, options) {
    this.stream = stream;
    this.options = options;
    this.#registerEvents();
    this.#init();
  }

  #registerEvents() {
    if(this.options.onLoad)
      this.options.onLoad(this.stream);

    if (this.hasVideo()) {
      var videoTrack = this.stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        if (this.options.onVideoEnded)
          this.options.onVideoEnded();

        this.endedVideo = true;
        this.checkEnded();
      };
    }

    if(this.hasAudio()) {
      var audioTrack = this.stream.getAudioTracks()[0];
      audioTrack.onended = () => {
        if (this.options.onAudioEnded)
          this.options.onAudioEnded();

        this.endedAudio = true;
        this.checkEnded();
      };
    }
  }

  #init() {
    this.toggleVideoTrack(this.options.videoInit);
    this.toggleAudioTrack(this.options.audioInit);
    this.endedAudio = !this.hasAudio();
    this.endedVideo = !this.hasVideo();
    this.checkEnded();
  }

  checkEnded() {
    if (this.endedAudio && this.endedVideo) {
      if(this.options.onEnded) 
        this.options.onEnded(this.stream);
    }
  }

  toggleVideoTrack(enabled) {
    var videoTrack = this.stream.getVideoTracks()[0];
    if(videoTrack) {
      if (enabled === undefined) {
        videoTrack.enabled = !videoTrack.enabled;
      } else {
        videoTrack.enabled = enabled;
      }
      switch (videoTrack.enabled) {
        case true:
          if(this.options.onVideoTrackEnable)
            this.options.onVideoTrackEnable(this.stream);
          break;
        case false:
          if(this.options.onVideoTrackDisable)
            this.options.onVideoTrackDisable(this.stream);
          break;
        default:
          break;
      }
    }
  }

  toggleAudioTrack(enabled) {
    var audioTrack = this.stream.getAudioTracks()[0];
    if(audioTrack) {
      if (enabled === undefined) {
        audioTrack.enabled = !audioTrack.enabled;
      } else {
        audioTrack.enabled = enabled;
      }
      switch (audioTrack.enabled) {
        case true:
          if(this.options.onAudioTrackEnable)
            this.options.onAudioTrackEnable(this.stream);
          break;
        case false:
          if(this.options.onAudioTrackDisable)
            this.options.onAudioTrackDisable(this.stream);
          break;
        default:
          break;
      }
    }
  }

  statusVideoTrack() {
    var videoTrack = this.stream.getVideoTracks()[0];
    if(videoTrack) return videoTrack.enabled;
  }

  statusAudioTrack() {
    var audioTrack = this.stream.getAudioTracks()[0];
    if(audioTrack) return audioTrack.enabled;
  }

  hasVideo() {
    return this.stream.getVideoTracks().length !== 0;
  }

  hasAudio() {
    return this.stream.getAudioTracks().length !== 0;
  }

  static async fromUserMedia(options) {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({
        video: {},
        audio: {},
      });
      return new Streamer(stream, options);
    } catch(err) {
      console.log(err);
      return undefined;
    }
  }

  static async fromDisplayMedia(options) {
    var stream = navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always",
      },
      audio: true
    });
    return new Streamer(stream, options);
  }
}

module.exports = Streamer;
