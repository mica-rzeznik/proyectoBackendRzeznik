import path from 'path'
import __dirname from '../utils.js'
import ioClient from 'socket.io-client'
import ChatService from '../services/db/chats.services.js'
import config from '../config/config.js'

const chatService = new ChatService()
const socket = ioClient(`http://localhost:${config.port}`)

export const getChatSocketController = async (req, res) => {
    try{
        res.render(path.join(__dirname, 'views', 'chat'))
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const postChatsController = async (req, res) => {
    try{
        let message = req.body
        let user = req.user.name
        const newMessage = await chatService.save(message, user)
        const messages = await chatService.getAll()
        const reverseMessages = messages.slice().reverse()
        socket.emit('message', reverseMessages)
        res.status(201).send( { status: "Success", message: `Mensaje enviado con éxito`, data: newMessage })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}