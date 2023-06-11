import mongoose from 'mongoose'

const collection = "users"

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

const schema = mongoose.Schema({
    first_name: stringTypeSchemaNonUniqueRequired,
    last_name: stringTypeSchemaNonUniqueRequired,
    email: stringTypeSchemaUniqueRequired,
    age: numberTypeSchemaNonUniqueRequired,
    password: stringTypeSchemaNonUniqueRequired,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
    loggedBy: stringTypeSchemaNonUniqueRequired,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        unique: true,
        required: true
    }
})

const userModel = mongoose.model(collection,schema)

export default userModel