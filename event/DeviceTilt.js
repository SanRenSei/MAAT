import eventDispatcher from "./Dispatcher.js";

class DeviceTilt {

  constructor() {
    window.addEventListener("deviceorientation", (evt) => {
      eventDispatcher.dispatchEvent({type:'tilt', alpha: evt.alpha, beta: evt.beta, gamma: evt.gamma});
    });
  }

}

let instance = new DeviceTilt();
export default instance;