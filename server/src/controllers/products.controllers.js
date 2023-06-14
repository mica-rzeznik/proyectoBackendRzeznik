import path from "path"
import __dirname from "../utils.js"
import ProductService from "../services/db/products.services.js"
import UsersDto from "../services/dto/user.dto.js"

const productService = new ProductService()

export const getDatosController = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const query = req.query.query
        const sort = req.query.sort
        const result = await productService.getAll(page, limit, query, sort)
        const prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : ''
        const nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : ''
        const products = result.docs
        res.render(path.join(__dirname, 'views', 'products'), {
            products: products,
            page: result.page,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            prevPage: result.prevPage,
            totalPages: result.totalPages,
            prevLink: prevLink,
            nextLink: nextLink,
            isValid: result.isValid,
            currentPage: page,
            user: req.user
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const getIdDatosController = async (req, res) => {
    try{
        const productoId = [await productService.getId(req.params.pid)]
        res.render(path.join(__dirname, 'views', 'products'), {
            products: productoId
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const postDatosController = async (req, res) => {
    try{
        let product = req.body
        const newProduct = await productService.save(product)
        res.status(200).send( { status: "Success", message: `Producto agregado con éxito con ID: ${product.id}`, data: newProduct })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const putDatosController = async (req, res) => {
    try{
        let productId = req.params.pID
        let productUpdated = req.body
        const productoActualizado = await productService.update(productId, productUpdated)
        res.send({ status: "Success", message: "Producto actualizado.", data: productoActualizado })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const deleteDatosController = async (req, res) => {
    try{
        let productId = req.params.pID
        await productService.delete(productId)
        return res.status(200).send({ status: "Success", message: "Producto eliminado." })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}