// let socket = io()

// socket.on('connect', () => {
//     console.log('Conectado al servidor socket')
// })

const mensaje = document.getElementById('chat')

mensaje.addEventListener('submit',e=>{
    e.preventDefault()
    const data = new FormData(mensaje)
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
            result.json();
            alert("Chat enviado con éxito!")
            window.location.replace('/chat')
        } else {
            return result.json().then((error) => {
                console.log(error.cause)
                alert('No se pudo enviar el mensaje: ' + error.message)
            })
        }
    }).then(
        json=>console.log(json))
})