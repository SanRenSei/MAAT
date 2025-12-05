import eventDispatcher from "./Dispatcher.js";

class Keyboard {

  constructor() {
    console.log('start keyboard')
    let computerEventTypes = ['keyup', 'keydown', 'keypress'];
    computerEventTypes.forEach(eventType => {
      document.addEventListener(eventType, e => {
        eventDispatcher.dispatchEvent(e);
      });
    })
  }

  activateMobileInput() {
    let hiddenInput = document.getElementById('hiddenInput');
    hiddenInput.focus();
    hiddenInput.select();
  }

}

let keyboard = new Keyboard();
export default keyboard;