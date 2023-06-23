import mongoose from 'mongoose'

const chatsCollection = 'messages'

const stringTypeSchemaNonUniqueNonRequired = {
    type: String,
    unique: false,
    required: false
}

const chatSchema = new mongoose.Schema({
    user: stringTypeSchemaNonUniqueNonRequired,
    message: stringTypeSchemaNonUniqueNonRequired
})

export const chatModel = mongoose.model (chatsCollection, chatSchema)