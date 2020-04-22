const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Entrar na sala
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Mensagens vindas do server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Envio de mensagens
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Recupera a mensagem 
    const msg = e.target.elements.msg.value;

    // Envia mensagem para o server
    socket.emit('chatMessage', msg);

    // Limpa o campo apos enviar a mensagems
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Adicionar a mensagem na conversa
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Adicionar o nome da sala
function outputRoomName(room) {
    roomName.innerText = room;
}

// Adicionar usuario na lista
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}