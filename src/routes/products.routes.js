import Router from 'express'
const router = Router()
import fs from 'fs'
import products from '../../Productos.json' assert { type: "json" }

router.get('/', async (req, res) => {
    const limit = req.query.limit || products.length
    const productosLimite = products.slice(0, limit)
    res.send(productosLimite)
})

router.get('/:pid', async (req, res) => {
    let productId = parseInt(req.params.pid)
    const filtroID = JSON.parse(await fs.promises.readFile('./Productos.json')).find((p) => p.id == productId)
    if(!filtroID){
        res.status(400).send({ status: "Error", message: "No existe ese id"})
    }else{
        res.send(filtroID)
    }
})

router.post('/', async (req, res) => {
    try{
        let producto = req.body
        if(!fs.existsSync("./Productos.json")){
            await fs.promises.writeFile("./Productos.json","[]")
        }
        for (const item of products) {
            if(
            producto.title === "" ||
            producto.description === "" ||
            producto.price === "" ||
            producto.thumbnail === "" ||
            producto.code === "" ||
            producto.stock === ""
            ){
                res.status(400).send({ status: "Error", message: "Por favor, complete todos los campos solicitados." })
                return
            }
            else if (producto.code === item.code){
                res.status(400).send({ status: "Error", message: "Ese ítem ya existe"})
                return
            }
        }
        const allProducts = JSON.parse(await fs.promises.readFile("./Productos.json", 'utf-8'))
        const highestId = allProducts.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0)
        producto.id = highestId + 1
        // products.push(producto)
        allProducts.push(producto)
        await fs.promises.writeFile("./Productos.json", JSON.stringify(allProducts, null, 2))
        res.send({ status: "Success", message: `Producto agregado con éxito con ID: ${producto.id}` })
    }catch(error){
        res.status(500).send({ status: "Error", message: "No se pudo agregar el producto" })
    }
})

router.put('/:pID', async (req, res) => {
    let productId = parseInt(req.params.pID)
    let productUpdated = req.body
    const productPosition = products.findIndex((p => p.id === productId))
    if (productPosition < 0) {
        return res.status(202).send({ status: "info", error: "Producto no encontrado" })
    }
    let productActual = products[productPosition]
    for (const [key, value] of Object.entries(productUpdated)) {
        if (productActual.hasOwnProperty(key)) {
            productActual[key] = value
        }
    }
    await fs.promises.writeFile("./Productos.json", JSON.stringify(products, null, 2))
    return res.send({ status: "Success", message: "Producto actualizado.", data: productActual })
})


router.delete('/:pID', async (req, res) => {
    let productId = parseInt(req.params.pID)
    const productsSize = products.length
    const productPosition = products.findIndex((p => p.id === productId))
    if (productPosition < 0) {
        return res.status(202).send({ status: "info", error: "Producto no encontrado" })
    }
    products.splice(productPosition, 1)
    if (products.length === productsSize) {
        return res.status(500).send({ status: "error", error: "El producto no se pudo borrar." })
    }
    await fs.promises.writeFile("./Productos.json", JSON.stringify(products, null, 2))
    return res.send({ status: "Success", message: "Producto eliminado." })
})

export default router