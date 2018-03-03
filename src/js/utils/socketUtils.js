import SocketMessageTypes from "../enum/SocketMessageTypes";

export const asyncWebSocketRequest = (socket, requestType, data, responseType) => {
  socket.send(`${requestType}/${data}`);

  return new Promise((resolve, reject) => {
    const onMessage = ({ data }) => {
        const type = data.split('/')[0];

        if (type === responseType) {
            resolve(data);
            socket.removeEventListener('message', onMessage);
        } else if (type === SocketMessageTypes.ERROR) {
            reject(data);
            socket.removeEventListener('message', onMessage);
        }
    };

    socket.addEventListener('message', onMessage);
  });
};