const socket = io();

const sendData = (data) => {
  socket.emit('data:resource', data);
}
