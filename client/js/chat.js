let socket = io()

socket.on('connect', () => {
    console.log('Conectado al servidor socket')
})

const chat = document.getElementById('chat')
const mensaje = document.getElementById('mensaje')
const messageLogs = document.getElementById('messageLogs')

socket.on('message', data => {
    let x = ''
    console.log('Datos recibidos:', data)
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
            // console.log(result)
            // alert("Chat enviado con éxito!")
            // window.location.replace('/chat')
            .then(user => {
                console.log('4')
                socket.emit('message', { user: user.first_name, message: mensaje.value })
                console.log(user.first_name)
                console.log(mensaje.value)
            })
            mensaje.value = ''
            window.location.reload()
        } else {
            return result.json().then((error) => {
                console.log(error.cause)
                alert('No se pudo enviar el mensaje: ' + error.message)
            })
        }
    }).then(
        json=>console.log(json))
})