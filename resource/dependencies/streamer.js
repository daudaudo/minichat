class Streamer {
  /**
   * 
   * @param {MediaStream} videoStream 
   * @param {MediaStream} audioStream 
   * @param {Object} options 
   */
  constructor(videoStream, audioStream, options) {
    this.videoStream = videoStream;
    this.audioStream = audioStream;
    this.options = options;
    this.registerEvents();
    this.init();
  }

  registerEvents() {
    if(this.options.onLoad)
      this.options.onLoad(this.videoStream, this.audioStream);

    if (this.hasVideo()) {
      var videoTrack = this.videoStream.getVideoTracks()[0];
      videoTrack.onended = () => {
        if (this.options.onVideoEnded)
          this.options.onVideoEnded(this.videoStream);
        this.videoStream = null;
      };
    }

    if(this.hasAudio()) {
      var audioTrack = this.audioStream.getAudioTracks()[0];
      audioTrack.onended = () => {
        if (this.options.onAudioEnded)
          this.options.onAudioEnded(this.audioStream);
        this.audioStream = null;
      };
    }
  }

  init() {
    this.toggleVideoTrack(this.options.videoInit);
    this.toggleAudioTrack(this.options.audioInit);
  }

  toggleVideoTrack(enabled) {
    if (!this.hasVideo()) return;
    var videoTrack = this.videoStream.getVideoTracks()[0];
    if(videoTrack) {
      if (enabled === undefined) {
        videoTrack.enabled = !videoTrack.enabled;
      } else {
        videoTrack.enabled = enabled;
      }
      switch (videoTrack.enabled) {
        case true:
          if(this.options.onVideoTrackEnable)
            this.options.onVideoTrackEnable(this.videoStream);
          break;
        case false:
          if(this.options.onVideoTrackDisable)
            this.options.onVideoTrackDisable(this.videoStream);
          break;
        default:
          break;
      }
    }
  }

  toggleAudioTrack(enabled) {
    if (!this.hasAudio()) return;
    var audioTrack = this.audioStream.getAudioTracks()[0];
    if(audioTrack) {
      if (enabled === undefined) {
        audioTrack.enabled = !audioTrack.enabled;
      } else {
        audioTrack.enabled = enabled;
      }
      switch (audioTrack.enabled) {
        case true:
          if(this.options.onAudioTrackEnable)
            this.options.onAudioTrackEnable(this.audioStream);
          break;
        case false:
          if(this.options.onAudioTrackDisable)
            this.options.onAudioTrackDisable(this.audioStream);
          break;
        default:
          break;
      }
    }
  }

  statusVideoTrack() {
    if (!this.hasVideo()) return;
    var videoTrack = this.videoStream.getVideoTracks()[0];
    if(videoTrack) return videoTrack.enabled;
  }

  statusAudioTrack() {
    if (!this.hasAudio()) return;
    var audioTrack = this.audioStream.getAudioTracks()[0];
    if(audioTrack) return audioTrack.enabled;
  }

  hasVideo() {
    if(!this.videoStream) return false;
    return this.videoStream.getVideoTracks().length !== 0;
  }

  hasAudio() {
    if(!this.audioStream) return false;
    return this.audioStream.getAudioTracks().length !== 0;
  }

  getVideoStream() {
    return this.videoStream;
  }

  getAudioStream() {
    return this.audioStream;
  }

  closeAll() {
    this.videoStream?.getTracks().forEach(function(track) {
      track.enabled = false
      track.stop();
    });

    this.audioStream?.getTracks().forEach(function(track) {
      track.enabled = false
      track.stop();
    });
    this.videoStream = null;
    this.audioStream = null;
  }

  static async fromUserMedia(options) {
    var constraint = await this.getConstraint();
    var audioStream = null;
    var videoStream = null;
    if (constraint.audio) {
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
      } catch(err) {console.log(err);}
    }
    
    if(constraint.video) {
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
      } catch(err) {console.log(err);}
    }

    return new Streamer(videoStream, audioStream, options);
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

  static async getConstraint() {
    try {
      var devices = await navigator.mediaDevices.enumerateDevices();
    } catch(err) {
      return {};
    }
    
    var videoinput = 0;
    var audioinput = 0;
    devices.forEach(device => {
      if(device.kind === 'audioinput')
        audioinput++;

      if(device.kind === 'videoinput')
        videoinput++;
    });

    return {
      video: videoinput !== 0,
      audio: audioinput !== 0,
    };
  }
}

module.exports = Streamer;
