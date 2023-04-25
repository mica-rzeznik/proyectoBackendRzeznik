import Router from 'express'
const router = Router()
import path from 'path'
import __dirname from '../utils.js'
import ioClient from 'socket.io-client'
import ProductManager from '../dao/filesystem/ProductManager.js'
import ProductService from '../dao/db/products.service.js'

const socket = ioClient('http://localhost:8080')
let producto = new ProductManager()
let productService = new ProductService()

router.get('/', async (req, res) => {
    try{
        // const productos = await producto.getProducts()
        const productos = await productService.getAll()
        const limit = req.query.limit || productos.length
        const productosLimite = productos.slice(0, limit)
        // res.send(productosLimite)
        res.render(path.join(__dirname, 'views', 'home'), {
            products: productosLimite
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.get('/realtimeproducts', async (req, res) => {
    res.render(path.join(__dirname, 'views', 'realTimeProducts'))
})

router.get('/:pid', async (req, res) => {
    try{
        // const productoId = [await producto.getProductById(parseInt(req.params.pid))]
        const productoId = [await productService.getId(req.params.pid)]
        // res.send(productoId)
        res.render(path.join(__dirname, 'views', 'home'), {
            products: productoId
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.post('/', async (req, res) => {
    try{
        let product = req.body
        const newProduct = await productService.save(product)
        res.status(200).send( { status: "Success", message: `Producto agregado con éxito con ID: ${product.id}`, data: newProduct })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.put('/:pID', async (req, res) => {
    try{
        let productId = req.params.pID
        let productUpdated = req.body
        // const productoActualizado = await producto.updateProduct(productId, productUpdated)
        const productoActualizado = await productService.update(productId, productUpdated)
        res.send({ status: "Success", message: "Producto actualizado.", data: productoActualizado })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

router.delete('/:pID', async (req, res) => {
    try{
        let productId = req.params.pID
        await productService.delete(productId)
        return res.status(200).send({ status: "Success", message: "Producto eliminado." })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
})

export default router