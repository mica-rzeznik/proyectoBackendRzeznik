import moongose from 'mongoose'

const collection = 'tickets'

const schema = new moongose.Schema({
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
        type: moongose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    purchaser_name: {
        type: String
    },
    purchaser_email: {
        type: String
    },
    cart: {
        type: moongose.SchemaTypes.ObjectId,
        ref: 'carts'
    },
    amount: Number
})

// schema.pre('findOne', function() {
//     this.populate('users.users carts.carts')
// })
// schema.pre('find', function (){
//     this.populate('users.users carts.carts')
// })

const ticketsModel = moongose.model(collection, schema)
export default ticketsModel