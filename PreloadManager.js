
import audioManager from './AudioManager.js';
import fontManager from './FontManager.js';
import spriteManager from './SpriteManager.js';

class PreloadManager {

  constructor() {}

  preload() {
    let audios = [];
    let sprites = [];
    let fonts = [];
    audios.forEach(audio => {
      audioManager.load(audio);
    })
    sprites.forEach(sprite => {
      spriteManager.load(sprite);
    });
    fonts.forEach(font => {
      fontManager.load(font);
    })
  }

}

let preloadManager = new PreloadManager();
export default preloadManager;

