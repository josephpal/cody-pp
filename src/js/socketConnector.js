import SocketMessageTypes from './enum/SocketMessageTypes'
import { browserType } from './utils/validationUtils'

class SocketConnector {
  constructor() {
    this.messageListeners = [];
    this.closeListeners = [];
    this.openListeners = [];
    this.socket = null;
    this.connected = false;

    window.addEventListener('beforeunload', () => {
      if (this.socket) {
        this.socket.close();
        this.close();
      }
    });
  }

  getStatus() {
    return this.connected;
  }

  connect(ip) {
    return new Promise((resolve, reject) => {
      /* console.log("current ip: " + location.host); */
      let hostIP = location.hostname;
      let port = Number(location.port);

      console.log(ip);
      console.log(hostIP);
      console.log(port);

      if(ip.includes("192.")) {
        console.log("local ip -> ws on port 90");
        port = 90;
      } else {
        console.log("global ip -> port forwarding enabled -> ws on port " + port + " + 1: ");
        port = port + 1;

        console.log(port);
      }

      this.socket = new WebSocket(`ws://${ip}:` + port.toString() );

      this.socket.onclose = function() {
        this.connected = false;
      };

      this.socket.addEventListener('open', () => {
        this.connected = true;

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

      if( requestType === SocketMessageTypes.PING ) {
          var currentdate = new Date();
          var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ":" + currentdate.getMilliseconds();

          console.log("Sending: PING @" + datetime);
      }

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
        var currentdate = new Date();
        var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ":" + currentdate.getMilliseconds();

        console.error("Websocket server connection timed out @" + datetime)
        this.close();
      }, 3500);

      return this.send(SocketMessageTypes.PING, '', SocketMessageTypes.PONG)
        .then(() => {
          var currentdate = new Date();
          var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ":" + currentdate.getMilliseconds();

          console.log("Received: PONG @" + datetime);
            if (this.pingPongTimeout) {
              console.log("Clearing timeout ...");
              clearTimeout(this.pingPongTimeout);
            }
        })
        .catch((err) => (console.error("Can not send ping!", err)));

    }, 5000);
  }
}

export default new SocketConnector();
