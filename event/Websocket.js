import eventDispatcher from "./Dispatcher.js";

class WebsocketConnection {

  constructor() {
    this.connection = null;
    this.url = null;
    this.connectionId = 0;
    this.uuid = localStorage.wsUUID || null;
    this.retryDelay = 1000;
    this.maxRetryDelay = 1000*60*60*24;
  }

  connect() {
    if (!this.url) {
      console.log('Need to set URL before connecting');
      return;
    }
    if (this.connection && this.connection.readyState <= 1) {
      return;
    }
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if (!window.WebSocket) {
      console.log("No WebSocket available");
      return;
    }
    this.connection = new WebSocket(this.url);
    console.log(this.connection);

    this.connection.onopen = () => {
      console.log('Connection Opened');
      eventDispatcher.dispatchEvent({type:'socketopen'});
      this.retryDelay = 1000;
      if (this.uuid) {
        this.sendMessage({type:'reconnect', uuid: this.uuid});
      }
    };

    this.connection.onmessage = (message) => {
      try {
        var jsonMsg = JSON.parse(message.data || message.utf8Data);
        if (jsonMsg.tag == 'connected') {
          this.connectionId = jsonMsg.id;
        }
        if (jsonMsg.tag == 'uuid' && !this.uuid) {
          this.uuid = jsonMsg.uuid;
          localStorage.wsUUID = jsonMsg.uuid;
        }
        jsonMsg.type = 'socket';
        eventDispatcher.dispatchEvent(jsonMsg);
      } catch (e) {
        console.log(e);
        console.log('This doesn\'t look like a valid JSON: ', message.data);
      }
    };

    this.connection.onclose = evt => {
      console.log('Connection closed');
      console.log(evt)
      setTimeout(() => this.connect(), this.retryDelay);
      this.retryDelay = Math.min(this.retryDelay * 2, this.maxRetryDelay);
    };

    this.connection.onerror = _ => {
      this.connection.close();
    };
  }

  sendMessage(msg) {
    this.connection.send(JSON.stringify(msg));
  }

}

let websocket = new WebsocketConnection();
export default websocket;