class AudioUtils {
  constructor() {
    this.duration = null;
    this.id = null;
    this.audio = null;
  }

  async load(audioBase64, hasType, endCallback) {
    const source = hasType ? audioBase64 : `data:audio/mpeg;base64,${audioBase64}`;

    this.pause();
    this.id += 1;

    this.audio = new Audio(source);
    this.audio.addEventListener('loadeddata', () => {
      this.duration = this.audio.duration;
    });

    if (endCallback) {
      this.audio.addEventListener('ended', endCallback);
    }

    this.audio.addEventListener('canplay', () => {
      this.audio.play().catch((e) => {
        console.error(e);
      });
    });
    this.audio.load();

    return this.audio;
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  play() {
    if (this.audio) {
      this.audio.play();
    }
  }

  getDuration() {
    if (this.duration) {
      return this.duration;
    }
    return null;
  }

  getId() {
    return this.id;
  }
}

export default new AudioUtils();
