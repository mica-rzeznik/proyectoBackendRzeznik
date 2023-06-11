import mongoose from 'mongoose'

const cartsCollection = 'carts'

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
                },
                partialAmount: {
                    type: Number,
                    default: 0
                }
            }
        ],
        default: []
    },
    totalAmount: {
        type: Number,
        default: 0
    }
})
cartSchema.pre('save', function(next) {
    const cart = this
    cart.totalAmount = 0
    for (const product of cart.products) {
        product.partialAmount = product.product.price * product.quantity
        cart.totalAmount += product.partialAmount
    }
    next()
})
cartSchema.pre('findOne', function (){
    this.populate("products.product")
})
cartSchema.pre('find', function (){
    this.populate("products.product")
})

export const cartModel = mongoose.model (cartsCollection, cartSchema)