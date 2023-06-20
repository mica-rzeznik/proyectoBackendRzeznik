// let socket = io()

// const cardProductos = document.getElementById("prod")

// socket.on('connect', () => {
//     console.log('Conectado al servidor socket')
// })

// socket.on('new-product', (data) => {
//     console.log('Datos recibidos:', data)
//     let x = ''
//     data.products.forEach(y=>{
//         x += 
//             `<div class="col">
//                 <div class="card" style="width: 18rem;">
//                     <img src="${y.thumbnail}" class="card-img-top" alt="imagen del producto" style="width: 200px">
//                     <div class="card-body">
//                         <h5 class="card-title">${y.title}</h5>
//                         <p class="card-text">${y.description}</p>
//                         <h6 class="card-subtitle mb-2 text-muted">${y.price} sickles de plata</h6>
//                         <a href="#" class="btn btn-primary">Agregar al carrito</a>
//                     </div>
//                 </div>
//             </div>`
//     })
//     cardProductos.innerHTML=x
// })

const logout = document.getElementById('logout')

logout.addEventListener('click',e=>{
    e.preventDefault()
    fetch('/api/jwt/logout', {
        method: 'POST',
    }).then((response) => {
    if (response.ok) {
        window.location.replace('/users/login')
    } else {
        console.error('Error al hacer logout')
    }
    }).catch((error) => {
        console.error('Error al hacer logout', error)
    })
})

function agregarProducto(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'POST' })
    .then((response) => {
        if (response.ok) {
            window.location.replace(`/api/carts/${cartId}`)
        } else {
            return response.json().then((error) => {
                console.log(error.cause)
                alert('No se pudo agregar el producto al carrito: ' + error.message)
            })
        }})
    .catch(error => console.error(error))
}

function eliminarProducto(cartId, productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' })
    .then((response) => {
        if (response.ok) {
            window.location.replace(`/api/carts/${cartId}`)
        } else {
            console.error('Error al eliminar el producto')
        }})
    .catch(error => console.error(error))
}

function comprar(cartId) {
    fetch(`/api/tickets/${cartId}`, { method: 'POST' })
    .then((response) => {
        if (response.ok) {
            window.location.replace(`/api/products`)
        } else {
            console.error('Error al generar el ticket')
        }})
    .catch(error => console.error(error))
}