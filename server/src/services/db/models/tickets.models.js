import mongoose from 'mongoose'

const collection = 'tickets'

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: () => Math.random().toString(36).substring(2, 8),
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    purchaser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    purchaser_name: {
        type: String
    },
    purchaser_email: {
        type: String
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'carts'
    },
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
                },
                partialAmount: {
                    type: Number,
                    default: 0
                }
            }
        ],
        default: []
    },
    amount: Number
})

schema.pre('findOne', function (){
    this.populate("products.product")
})
schema.pre('find', function (){
    this.populate("products.product")
})

const ticketsModel = mongoose.model(collection, schema)
export default ticketsModel