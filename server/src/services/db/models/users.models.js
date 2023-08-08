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

const stringTypeSchemaNonUniqueNonRequired = {
    type: String,
    unique: false,
    required: false
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
        enum: ['user', 'admin', 'premium'],
    },
    loggedBy: stringTypeSchemaNonUniqueRequired,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        unique: true,
        required: true
    }, 
    last_connection: stringTypeSchemaNonUniqueNonRequired,
    documents: {
        type: [
            {
                name:{
                    type: String
                },
                reference: {
                    type: String
                }
            }
        ],
        default: []
    }
})

const userModel = mongoose.model(collection,schema)

export default userModel