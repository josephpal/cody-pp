import SocketMessageTypes from "../enum/SocketMessageTypes";

export const asyncWebSocketRequest = (socket, requestType, data, responseType) => {
  socket.send(`${requestType}/${data}`);

  return new Promise((resolve, reject) => {
    socket.onmessage(({ data }) => {
       const type = data.split('/')[0];

       if (type === responseType) {
           resolve(data);
       } else if (type === SocketMessageTypes.ERROR) {
           reject(data);
       }
    });
  });
};