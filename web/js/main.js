// get url params
let {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});
username = username ? username.trim() : ''; room = room ? room.trim() : '';

console.log(username, '\n\n', room);

// Start socket connection
const socket = io();
const userSocket = io('/users');

if(!username||!room){
    location.href = '/';
}

// join room
socket.emit('joinRoom', username, room);

socket.on('hello-message', (a)=>{
    console.log(a);
})

socket.on('joiningInfo', (info)=>{
    room_name.innerText = '';
    room_name.innerText = info.room;
    users.innerHTML = '';
    let usersArr = [];
    info.roomUsers.forEach(user => {
        usersArr.push(`<li class="${user.me ? 'me-li' : ''}">${user.name}</li>`)
    });
    users.innerHTML = usersArr.join('');
})

// functions
function showAMessage(userName, msg, time, type){
    let contDiv = document.createElement('div'),
    metaP = document.createElement('p'),
    timeSpan = document.createElement('span'),
    textP = document.createElement('p');

    timeSpan.innerText = time || '';

    metaP.classList.add('meta');
    metaP.innerText = userName+' ';
    metaP.appendChild(timeSpan);

    textP.classList.add('text');
    textP.innerText = msg;

    contDiv.classList.add('message');
    contDiv.appendChild(metaP);
    contDiv.appendChild(textP);

    contDiv.style.textAlign = ((type === 'me')? 'right':(type==='chat'? 'left': 'center'))

    chat_messages.appendChild(contDiv);

    chat_messages.scroll({top: contDiv.offsetTop, behavior: 'smooth'})
}

let handleReciviedMessage = (formatedMsg)=>{
    let {userName, msg, time, type} = formatedMsg;
    showAMessage(userName, msg, time, type);
};
// event listeners
chat_form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    let msg = ev.target.elements.msg.value;
    socket.emit('meMessage', 'Me', msg);
    socket.emit('chatMessage', username, msg);
    ev.target.elements.msg.value = '';
    ev.target.elements.msg.focus();
})

// Socket event listeners
socket.on('botMessage', handleReciviedMessage)

socket.on('chatMessage', handleReciviedMessage)

socket.on('meMessage', handleReciviedMessage)
