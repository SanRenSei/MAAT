import eventDispatcher from "./Dispatcher.js";

class Mouse {

  constructor() {
    this.lastX = 0;
    this.lastY = 0;
    let canvas = document.getElementById('mainCanvas');
    let computerEventTypes = ['pointermove', 'pointerdown', 'pointerup','pointercancel','wheel'];
    computerEventTypes.forEach(eventType => {
      canvas.addEventListener(eventType, e => {
        let wHeight = canvas.getBoundingClientRect().height, wWidth = canvas.getBoundingClientRect().width;
        e.translatedX = canvas.width*(e.offsetX/wWidth);
        e.translatedY = canvas.height*(e.offsetY/wHeight);
        eventDispatcher.dispatchEvent(e);
        if (e.type=='pointermove') {
          this.lastX = e.translatedX;
          this.lastY = e.translatedY;
        }
      });
    })
    canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }
  }

}

let instance = new Mouse();
export default instance;