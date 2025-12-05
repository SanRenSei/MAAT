class FontManager {

  constructor() {
    this.fonts = {};
  }

  hoistPaths(fontPaths) {
    this.fontPaths = fontPaths;
  }

  async load(fontName) {
    if (!this.fonts[fontName]) {
      let newFont = new FontFace(fontName, `url(${this.fontPaths[fontName]})`);
      this.fonts[fontName] = newFont;
      await newFont.load();
      document.fonts.add(newFont);
    }
  }

}

let fontManager = new FontManager();
export default fontManager;