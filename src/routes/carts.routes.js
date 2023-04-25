import Router from 'express'
const router = Router()
import path from 'path'
import __dirname from '../utils.js'
import ioClient from 'socket.io-client'
import CartManager from '../dao/filesystem/CartManager.js'
import CartService from '../dao/db/carts.service.js'

let carrito = new CartManager()
let cartService = new CartService()

router.get('/', async (req, res) => {
    try{
        // const carritos = await carrito.getCarts()
        const carritos = await cartService.getAll()
        res.render(path.join(__dirname, 'views', 'cart'), {
            cart: carritos
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.get('/:cID', async (req, res) => {
    try{
        // const cartId = [await carrito.getCartById(parseInt(req.params.cID))]
        const cartId = [await cartService.getId(req.params.cID)]
        res.render(path.join(__dirname, 'views', 'cart'), {
            cart: cartId
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.post('/', async (req, res) => {
    try{
        // const newCart = await carrito.addCart()
        const newCart = await cartService.save()
        res.status(200).send( { status: "Success", message: `Nuevo carrito creado con ID: ${newCart.id}`, data: newCart })
    }catch(error){
        res.status(500).send({ status: "Error", message: "No se pudo crear el carrito" })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        // const agregarProducto = await carrito.addProductToCart(cartId, productId)
        const agregarProducto = await cartService.saveProduct(cartId, productId)
        res.status(200).send( { status: "Success", message: "Producto agregado al carrito..", data: agregarProducto })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const eliminarProducto = await cartService.deleteProduct(cartId, productId)
        res.status(200).send( { status: "Success", message: "Producto borrado del carrito.", data: eliminarProducto })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.delete('/:cid', async (req, res) => {
    try{
        const cartId = req.params.cid
        const eliminarProductos = await cartService.deleteCart(cartId)
        res.status(200).send( { status: "Success", message: "Productos borrados del carrito.", data: eliminarProductos })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

export default router