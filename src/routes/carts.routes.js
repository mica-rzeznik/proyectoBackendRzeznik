import Router from 'express'
const router = Router()
import fs from 'fs'
import carts from '../../Carritos.json' assert { type: "json" }
import products from '../../Productos.json' assert { type: "json" }

router.get('/', async (req, res) => {
    res.send(carts)
})

router.get('/:cID', async (req, res) => {
    let cartId = parseInt(req.params.cID)
    const filtroID = JSON.parse(await fs.promises.readFile('./Carritos.json')).find((c) => c.id == cartId)
    if(!filtroID){
        res.status(400).send({ status: "Error", message: "No existe ese id"})
    }else{
        res.send(filtroID)
    }
})

router.post('/', async (req, res) => {
    try{
        let carrito = {
            products: [],
        }
        if(!fs.existsSync("./Carritos.json")){
            await fs.promises.writeFile("./Carritos.json","[]")
        }
        const allCarts = JSON.parse(await fs.promises.readFile("./Carritos.json", 'utf-8'))
        const highestId = allCarts.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0)
        carrito.id = highestId + 1
        carts.push(carrito)
        allCarts.push(carrito)
        await fs.promises.writeFile("./Carritos.json", JSON.stringify(allCarts, null, 2))
        res.send({ status: "Success", message: `Nuevo carrito creado con ID: ${carrito.id}` })
    }catch(error){
        res.status(500).send({ status: "Error", message: "No se pudo crear el carrito" })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const productId = parseInt(req.params.pid)
    const cartPosition = carts.findIndex((c => c.id === cartId))
    if (cartPosition < 0) {
        return res.status(404).send({ status: "info", error: "Carrito no encontrado" })
    }
    const productPosition = products.findIndex((p => p.id === productId))
    if (productPosition < 0) {
        return res.status(404).send({ status: "info", error: "Producto no encontrado" })
    }
    const carrito = carts[cartPosition]
    const productRepe = carrito.products.find((p => p.product === productId))
    if(productRepe){
        productRepe.quantity += 1
    }else{
        carrito.products.push({product: productId, quantity: 1})
    }
    await fs.promises.writeFile("./Carritos.json", JSON.stringify(carts, null, 2))
    return res.send({ status: "Success", message: "Producto agregado al carrito.", data: carrito })
})

// router.put('/:cID', async (req, res) => {
//     let cartId = parseInt(req.params.cID)
//     let cartUpdated = req.body
//     const cartPosition = carts.findIndex((p => p.id === cartId))
//     if (cartPosition < 0) {
//         return res.status(202).send({ status: "info", error: "Carrito no encontrado" })
//     }
//     let cartActual = carts[cartPosition]
//     for (const [key, value] of Object.entries(cartUpdated)) {
//         if (cartActual.hasOwnProperty(key)) {
//             cartActual[key] = value
//         }
//     }
//     await fs.promises.writeFile("./Carritos.json", JSON.stringify(carts, null, 2))
//     return res.send({ status: "Success", message: "Carrito actualizado.", data: cartActual })
// })


// router.delete('/:cID', async (req, res) => {
//     let cartId = parseInt(req.params.pID)
//     const cartsSize = carts.length
//     const cartPosition = carts.findIndex((p => p.id === cartId))
//     if (cartPosition < 0) {
//         return res.status(202).send({ status: "info", error: "Carrito no encontrado" })
//     }
//     carts.splice(cartPosition, 1)
//     if (carts.length === cartsSize) {
//         return res.status(500).send({ status: "error", error: "El carrito no se pudo borrar." })
//     }
//     await fs.promises.writeFile("./Carritos.json", JSON.stringify(carts, null, 2))
//     return res.send({ status: "Success", message: "Carrito eliminado." })
// })

export default router