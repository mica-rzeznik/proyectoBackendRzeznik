import mongoose, {SchemaTypes} from 'mongoose'

const cartsCollection = 'carts'

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

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
})

cartSchema.pre('findOne', function (){
    this.populate("products.product")
})
cartSchema.pre('find', function (){
    this.populate("products.product")
})
export const cartModel = mongoose.model (cartsCollection, cartSchema)