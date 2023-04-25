let socket = io()

const cardProductos = document.getElementById("prod")

socket.on('connect', () => {
    console.log('Conectado al servidor socket')
})

socket.on('new-product', (data) => {
    console.log('Datos recibidos:', data)
    let x = ''
    data.products.forEach(y=>{
        x += 
            `<div class="col">
                <div class="card" style="width: 18rem;">
                    <img src="${y.thumbnail}" class="card-img-top" alt="imagen del producto" style="width: 200px">
                    <div class="card-body">
                        <h5 class="card-title">${y.title}</h5>
                        <p class="card-text">${y.description}</p>
                        <h6 class="card-subtitle mb-2 text-muted">${y.price} sickles de plata</h6>
                        <a href="#" class="btn btn-primary">Agregar al carrito</a>
                    </div>
                </div>
            </div>`
    })
    cardProductos.innerHTML=x
})