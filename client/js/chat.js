let socket = io()

const chat = document.getElementById('chat')
const mensaje = document.getElementById('mensaje')
const messageLogs = document.getElementById('messageLogs')

socket.on('connect', () => {
    console.log('Conectado al servidor socket')
})

chat.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(chat)
    const obj = {}
    data.forEach((value,key)=>obj[key]=value)
    fetch('/chat',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result=> {
        if (result.status === 201) {
            result.json()
            mensaje.value = ''
        } else {
            return result.json().then((error) => {
                console.error(error.cause)
                alert('No se pudo enviar el mensaje: ' + error.message)
            })
        }
    })
})

socket.on('messageLogs', data => {
    let x = ''
    data.forEach(y=>{
        x +=
            `<div class="card">
                <div class="card-header">
                    ${y.user}
                </div>
                <div class="card-body">
                    <blockquote class="blockquote mb-0">
                        <p>${y.message}</p>
                    </blockquote>
                </div>
            </div>`
    })
    messageLogs.innerHTML = x
})