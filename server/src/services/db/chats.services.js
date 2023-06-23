import { chatModel } from "./models/chat.models.js"

export default class ChatService {
    constructor() {
        console.log("Working messages with Database persistence in mongodb")
    }
    getAll = async () => {
        let messages = await chatModel.find()
        return messages.map(c => c.toObject())
    }
    save = async (message, user) => {
        let newChat = await chatModel.create({})
        let mensaje = message.message
        let result = await chatModel.findByIdAndUpdate(newChat._id, {
            message: mensaje, 
            user: user
        })
        return result
    }
}