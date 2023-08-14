import path from "path"
import __dirname from "../utils.js"
import ProductService from "../services/db/products.services.js"
import UsersDto from "../services/dto/user.dto.js"
import CustomError from "../services/error/CustomError.js"
import { generateProductErrorInfo } from "../services/error/messages/product-creation-error.message.js"
import EErrors from "../services/error/errors-enum.js"
import UserService from "../services/db/users.services.js"

const productService = new ProductService()
const userService = new UserService()

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
        const userId = (await userService.findByUsername(req.user.email))._id
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
            user: req.user,
            userId: userId
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const getIdDatosController = async (req, res) => {
    try{
        const productoId = await productService.getId(req.params.pid)
        const userId = (await userService.findByUsername(req.user.email))._id
        res.render(path.join(__dirname, 'views', 'product'), {
            product: productoId,
            user: req.user,
            userId: userId
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const postDatosController = async (req, res) => {
    try{
        let product = req.body
        let producto = {
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            category: product.category,
            owner: req.user.email
        }
        let title = product.title
        if (!title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category) {
            CustomError.createError({
                name: "Product Creation Error",
                cause: generateProductErrorInfo(product),
                message: "Error tratando de crear el producto",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        const newProduct = await productService.save(producto)
        res.status(201).send( { status: "Success", message: `Producto agregado con éxito con ID: ${newProduct._id}`, data: newProduct })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const putDatosController = async (req, res) => {
    try{
        let productId = req.params.pID
        let productUpdated = req.body
        let product = await productService.getId(productId)
        if (req.user.email != product.owner & req.user.rol != 'admin') {
            throw new Error(`Usuario no autorizado`)
        }
        const productoActualizado = await productService.update(productId, productUpdated)
        res.send({ status: "Success", message: "Producto actualizado.", data: productoActualizado })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}

export const deleteDatosController = async (req, res) => {
    try{
        let productId = req.params.pID
        let product = await productService.getId(productId)
        if (req.user.email != product.owner & req.user.rol != 'admin') {
            throw new Error(`Usuario no autorizado`)
        }
        await productService.delete(productId)
        return res.status(200).send({ status: "Success", message: "Producto eliminado." })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message })
    }
}