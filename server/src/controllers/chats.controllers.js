import path from 'path'
import __dirname from '../utils.js'
import ioClient from 'socket.io-client'
import ChatService from '../services/db/chats.services.js'

const chatService = new ChatService()

export const getChatsController = async (req, res) => {
    try{
        const messages = await chatService.getAll()
        res.render(path.join(__dirname, 'views', 'chat'), {
            message: messages
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const postChatsController = async (req, res) => {
    try{
        let message = req.body
        let user = req.user.name
        // let user = 'userPrueba'
        const newMessage = await chatService.save(message, user)
        res.status(201).send( { status: "Success", message: `Mensaje enviado con éxito`, data: newMessage })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}