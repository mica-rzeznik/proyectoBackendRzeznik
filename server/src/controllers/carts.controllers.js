import path from "path"
import __dirname from "../utils.js"
import CartService from "../services/db/carts.services.js"
import ProductService from "../services/db/products.services.js"
import CustomError from "../services/error/CustomError.js"
import { addProductErrorInfo } from "../services/error/messages/productoCarrito-error.message.js"
import EErrors from "../services/error/errors-enum.js"

let cartService = new CartService()
let productService = new ProductService()

export const getDatosController = async (req, res) => {
    try{
        const carritos = await cartService.getAll()
        res.render(path.join(__dirname, 'views', 'cart'), {
            cart: carritos
        })
    }catch(error){
        res.status(500).render(path.join(__dirname, 'views', 'error'), {
            error: error.message
        })
    }
}
export const getIdDatosController = async (req, res) => {
    try{
        const cartId = [await cartService.getIdObject(req.params.cID)]
        res.render(path.join(__dirname, 'views', 'cart'), {
            cart: cartId
        })
    }catch(error){
        res.status(500).render(path.join(__dirname, 'views', 'error'), {
            error: error.message
        })
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
        const cart = await cartService.getIdObject(cartId)
        const product = await productService.getId(productId)
        if (!product || !cart) {
            CustomError.createError({
                name: "Add Product to Cart Error",
                cause: addProductErrorInfo(productId, cartId),
                message: "Error tratando de agregar el producto al carrito",
                code: EErrors.ROUTING_ERROR
            })
        }
        if (req.user.email === product.owner) {
            throw new Error(`Usuario no autorizado`)
        }
        const newCart = await cartService.saveProduct(cartId, productId)
        res.status(200).send( { status: "Success", message: "Producto agregado al carrito exitosamente" , data: newCart })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
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