
class EventDispatcher {
  subscriptions: { [key: string]: { handler: (e) => boolean|null, priority: number }[] };

  constructor() {
    this.subscriptions = {};
  }

  subscribeTo(evtType:string, handler: (e) => boolean|null, priority:number = 0) {
    if (!this.subscriptions[evtType]) {
      this.subscriptions[evtType] = [];
    }
    if (this.subscriptions[evtType].some(s => s.handler == handler)) {
      return;
    }
    this.subscriptions[evtType].push({ handler, priority });
    this.subscriptions[evtType].sort((a, b) => b.priority - a.priority);
  }

  unsubscribeFrom(evtType:string, handler: (e) => boolean|null) {
    this.subscriptions[evtType] = this.subscriptions[evtType].filter(s => s.handler !== handler);
    if (this.subscriptions[evtType].length == 0) {
      delete this.subscriptions[evtType];
    }
  }

  dispatchEvent(evt) {
    let {type} = evt;
    if (!this.subscriptions[type]) {
      return;
    }
    for (let { handler } of this.subscriptions[type]) {
      if (handler(evt)) {
        return;
      }
    }
  }

}

let eventDispatcher = new EventDispatcher();
export default eventDispatcher;