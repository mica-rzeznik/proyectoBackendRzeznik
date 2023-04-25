import { productModel } from '../db/models/products.js'
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId

class ProductService {
    constructor() {
        console.log("Working products with Database persistence in mongodb")
    }

    getAll = async () => {
        let products = await productModel.find()
        return products.map(p => p.toObject())
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
export default ProductService