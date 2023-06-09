import path from "path"
import __dirname from "../utils.js"
import CartService from "../services/db/carts.services.js"

let cartService = new CartService()

export const getDatosController = async (req, res) => {
    try{
        const carritos = await cartService.getAll()
        res.render(path.join(__dirname, 'views', 'cart'), {
            cart: carritos
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}
export const getIdDatosController = async (req, res) => {
    try{
        const cartId = [await cartService.getId(req.params.cID)]
        res.render(path.join(__dirname, 'views', 'cart'), {
            cart: cartId
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}
export const postDatosController = async (req, res) => {
    try{
        const newCart = await cartService.save()
        res.status(200).send( { status: "Success", message: `Nuevo carrito creado con ID: ${newCart.id}`, data: newCart })
    }catch(error){
        res.status(500).send({ status: "Error", message: "No se pudo crear el carrito" })
    }
}
export const postProductDatosController = async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartService.saveProduct(cartId, productId)
        res.status(200).redirect('/api/products')
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}
export const deleteProductDatosController = async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const eliminarProducto = await cartService.deleteProduct(cartId, productId)
        res.status(200).send( { status: "Success", message: "Producto borrado del carrito.", data: eliminarProducto })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const deleteDatosController = async (req, res) => {
    try{
        const cartId = req.params.cid
        const eliminarProductos = await cartService.deleteCart(cartId)
        res.status(200).send( { status: "Success", message: "Productos borrados del carrito.", data: eliminarProductos })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}