import mongoose, {SchemaTypes} from 'mongoose'

const productsCollection = 'products'

const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
}

const numberTypeSchemaUniqueRequired = {
    type: Number,
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
    status: Boolean,
    thumbnail: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    stock: numberTypeSchemaNonUniqueRequired,
    category: stringTypeSchemaNonUniqueRequired
})

export const productModel = mongoose.model (productsCollection, productSchema)