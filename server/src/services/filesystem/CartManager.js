import fs from 'fs'

class CartManager {
    constructor (){
        this.products = []
        this.path = "./src/dao/filesystem/files/Carritos.json"
    }
    save = async () => {
        try{
            if(!fs.existsSync(this.path)){
                await fs.promises.writeFile(this.path,"[]")
            }
            let carrito = {
                products: []
            }
            const allCarts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const highestId = allCarts.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0)
            carrito.id = highestId + 1
            allCarts.push(carrito)
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2))
            return carrito
        }catch(error){
            if(!error.message){
                throw new Error("No se pudo crear el carrito.")
            }
            throw new Error(error.message)
        }
    }
    getAll = async () => {
        try {
            return JSON.parse(await fs.promises.readFile(this.path))
        } catch (error) {
            throw new Error("No se encontraron carritos")
        }
    }
    getId = async (id) => {
        const filtroID = JSON.parse(await fs.promises.readFile(this.path)).find((c) => c.id == id)
        if(!filtroID){
            throw new Error("Carrito no encontrado")
        }
        return filtroID
    }
    saveProduct = async (cartId, productId) => {
        try{
            const allCarts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const cartPosition = allCarts.findIndex((c => c.id === cartId))
            if (cartPosition < 0) {
                throw new Error("Carrito no encontrado" )
            }
            const allProducts = JSON.parse(await fs.promises.readFile('./src/dao/filesystem/files/Productos.json', 'utf-8'))
            const productPosition = allProducts.findIndex((p => p.id === productId))
            if (productPosition < 0) {
                throw new Error("Producto no encontrado" )
            }
            const carrito = allCarts[cartPosition]
            const productRepe = carrito.products.find((p => p.product === productId))
            if(productRepe){
                productRepe.quantity += 1
            }else{
                carrito.products.push({product: productId, quantity: 1})
            }
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2))
            return carrito
        }catch(error){
            throw new Error(error.message)
        }
    }
    deleteProduct = async (cartId, productId) => {
        const allCarts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        const cartPosition = allCarts.findIndex((c => c.id === cartId))
        if (cartPosition < 0) {
            throw new Error("Carrito no encontrado" )
        }
        const carrito = allCarts[cartPosition]
        const productBorrarIndex = carrito.products.findIndex((p => p.product === productId))
        if(productBorrarIndex < 0){
            return res.status(404).send({ status: "info", error: "Producto no encontrado" })
        }else{
            const productBorrar = carrito.products[productBorrarIndex]
            productBorrar.quantity -= 1
            if(productBorrar.quantity == 0){
                carrito.products.splice(productBorrarIndex, 1)
            }
        }
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 2))
    }
    deleteCart = async (id) => {
        const cartsSize = JSON.parse(await fs.promises.readFile(this.path, 'utf-8')).length
        const existe = await this.getId(id)
        if (!existe) {
            throw new Error("Carrito no encontrado." )
        }
        const encontrado = (await JSON.parse(await fs.promises.readFile(this.path))).filter((p) => p.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(encontrado, null, 2))
        const listaActual = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        if (listaActual.length === cartsSize) {
            throw new Error("El carrito no se pudo borrar." )
        }
    }
}

export default CartManager