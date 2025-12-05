
class AudioManager {

  constructor() {
    this.audio = {};
  }

  hoistPaths(audioPaths) {
    this.audioPaths = audioPaths;
  }

  load(audioName) {
    if (!this.audio[audioName]) {
      let newAudio = new Audio(this.audioPaths[audioName]);
      this.audio[audioName] = newAudio;
    }
  }

  isLoaded(audioName) {
    if (!this.audio[audioName]) {
      this.load(audioName);
      return false;
    }
    return this.audio[audioName].complete;
  }

  playAudio(audioName) {
    if (!this.audio[audioName]) {
      this.load(audioName);
    }
    this.audio[audioName].volume = 0.4;
    this.audio[audioName].loop = true;
    this.audio[audioName].play();
  }

  pauseAudio(audioName) {
    if (!this.audio[audioName]) {
      return;
    }
    this.audio[audioName].pause();
  }

  stopAudio(audioName) {
    if (!this.audio[audioName]) {
      return;
    }
    this.audio[audioName].pause();
    this.audio[audioName].currentTime = 0;
  }

}

let audioManager = new AudioManager();
export default audioManager;