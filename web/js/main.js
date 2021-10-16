const socket = io();
// const userSocket = io('/users');

socket.on('hello-message', (a)=>{
    console.log(a)
})


// functions
function showAMessage(userName, msg, time){
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

    chat_messages.appendChild(contDiv);

    chat_messages.scroll({top: contDiv.getBoundingClientRect().top, behavior: 'smooth'})
}

// event listeners
chat_form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    let msg = ev.target.elements.msg.value;
    showAMessage('me', msg);
    socket.emit('chatMessage', 'UserName', msg);
    ev.target.elements.msg.value = '';
    ev.target.elements.msg.focus();
})

// Socket event listeners
socket.on('botMessage', (formatedMsg)=>{
    let {userName, msg, time} = formatedMsg;
    showAMessage(userName, msg, time);
})

socket.on('chatMessage', (formatedMsg)=>{
    let {userName, msg, time} = formatedMsg;
    showAMessage(userName, msg, time);
})