import mongoose from 'mongoose'
import { productModel } from '../models/products.models.js'
const ObjectId = mongoose.Types.ObjectId

export default class ProductService {
    constructor() {
        console.log("Working products with Database persistence in mongodb")
    }
    getAll = async (page, limit, query, sort) => {
        const options = {
            page: page || 1,
            limit: limit || 10,
            query: query || {},
            sort: sort || {},
            lean: true,
        }
        const result = await productModel.paginate({}, options)
        return result
        // return result.map(p => p.toObject())
    }
    save = async (product) => {
        let result = await productModel.create(product)
        return result
    }
    update = async (id, updatedProduct) => {
        let result = await productModel.findByIdAndUpdate(id, updatedProduct)
        return result
    }
    getId = async (id) => {
        let product = await productModel.findById(id)
        return product.toObject()
    }
    delete = async (id) => {
        if (!ObjectId.isValid(id)) {
            throw new Error(`ID de producto inválido: ${id}`)
        }
        try {
            const result = await productModel.findByIdAndDelete(new ObjectId(id))
            if (result === null) {
                throw new Error(`No se pudo eliminar el producto con id ${id}`)
            }
        } catch (error) {
            throw new Error(`Error al eliminar el producto con id ${id}: ${error.message}`)
        }
    }
}