import SocketMessageTypes from './enum/SocketMessageTypes'

class SocketConnector {
  constructor() {
    this.messageListeners = [];
    this.closeListeners = [];
    this.openListeners = [];
    this.socket = null;

    window.addEventListener('beforeunload', () => {
      if (this.socket) {
        this.close();
      }
    });
  }

  connect(ip) {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(`ws://${ip}:90`);

      this.socket.addEventListener('open', () => {
        this.socket.addEventListener('message', this._handleMessage.bind(this));

        this._startPingPong();

        for (const listener of this.openListeners) {
          if (listener) {
            listener();
          }
        }

        resolve();
      });

      this.socket.addEventListener('error', reject);
    });
  }

  send(requestType, data, responseType) {
    return new Promise((resolve, reject) => {
      this.socket.send(`${requestType}/${data}`);

      const onMessage = ({ data }) => {
          const type = data.split('/')[0];

          if (type === responseType) {
              resolve(data);
              this.socket.removeEventListener('message', onMessage);
          } else if (type === SocketMessageTypes.ERROR) {
              reject(data);
              this.socket.removeEventListener('message', onMessage);
          }
      };

      this.socket.addEventListener('message', onMessage.bind(this));
    });
  }

  close() {
    console.log('Closing connection');

    if( this.pingPongTimeout ) {
      clearTimeout(this.pingPongTimeout);
    }

    if( this.pingPongInterval ) {
      clearInterval(this.pingPongInterval);
    }

    for (const listener of this.closeListeners) {
      if (listener) {
        listener();
      }
    }

    if (this.socket) {
      this.socket.close();
      this.socket.removeEventListener('message', this._handleMessage);
    }
  }

  onOpen(listener) {
    this.openListeners.push(listener);
  }

  onClose(listener) {
    this.closeListeners.push(listener);
  }

  onMessage(listener) {
    this.messageListeners.push(listener);
  }

  _handleMessage(message) {
    for (const listener of this.messageListeners) {
      if (listener && message.data !== SocketMessageTypes.PONG) {
        listener(message.data);
      }
    }
  }

  _startPingPong() {
    this.pingPongInterval = setInterval(() => {
      this.pingPongTimeout = setTimeout(() => {
        console.error("Websocket server connection timed out!")
        this.close();
      }, 1000);

      return this.send(SocketMessageTypes.PING, '', SocketMessageTypes.PONG)
        .then(() => {
          console.log("Received: PONG");
            if (this.pingPongTimeout) {
              console.log("Clearing timeout ...");
              clearTimeout(this.pingPongTimeout);
            }
        })
        .catch((err) => (console.error("Can not send ping!", err)));

    }, 3000);
  }
}

export default new SocketConnector();
