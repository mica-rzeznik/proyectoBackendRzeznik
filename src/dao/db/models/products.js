import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
}

const stringTypeSchemaNonUniqueRequired = {
    type: String,
    unique: false,
    required: true
}

const numberTypeSchemaNonUniqueRequired = {
    type: Number,
    unique: false,
    required: true
}

const productSchema = new mongoose.Schema({
    title: stringTypeSchemaUniqueRequired,
    description: stringTypeSchemaUniqueRequired,
    price: numberTypeSchemaNonUniqueRequired,
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    thumbnail: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    stock: numberTypeSchemaNonUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired
})

productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model (productsCollection, productSchema)