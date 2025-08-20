const socket = io('http://localhost:3000');
console.log(socket.id);

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const typing = document.getElementById('typing');

const handleSubmitNewMessage = () => {
  socket.emit('message', message.value);
};

socket.on('message', (data) => {
  handleNewMessage(data);
});

//typing
let typingTimeOut;
message.addEventListener('keypress', () => {
  socket.emit('typing', socket.id);
});
socket.on('typing', (data) => {
  typing.textContent = `${data} is typing...`;
//   clearTimeout(typingTimeOut);
  typingTimeOut = setTimeout(() => {
    typing.textContent = '';
  }, 3000);
});

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  return li;
};
