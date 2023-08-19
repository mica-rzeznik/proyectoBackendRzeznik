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
                console.error(error.cause)
                alert('No se pudo agregar el producto al carrito: ' + error.message)
            })
        }})
    .catch(error => console.error(error))
}

function quitarProducto(cartId, productId) {
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

function eliminarProducto(productId) {
    fetch(`/api/products/${productId}`, { method: 'DELETE' })
    .then((response) => {
        if (response.ok) {
            window.location.replace(`/api/products`)
        } else {
            console.error('Error al eliminar el producto')
        }})
    .catch(error => console.error(error))
}