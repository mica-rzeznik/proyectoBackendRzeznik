import path from 'path'
import __dirname from '../utils.js'
import ioClient, { io } from 'socket.io-client'
import ChatService from '../services/db/chats.services.js'

const chatService = new ChatService()
const socket = ioClient('http://localhost:8080')

export const getChatSocketController = async (req, res) => {
    try{
        res.render(path.join(__dirname, 'views', 'chat'))
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const getChatsController = async (req, res) => {
    try{
        const messages = await chatService.getAll()
        const reverseMessages = messages.slice().reverse()
        res.render(path.join(__dirname, 'views', 'chat'), {
            message: reverseMessages
        })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const postChatsController = async (req, res) => {
    try{
        let message = req.body
        let user = req.user.name
        const newMessage = await chatService.save(message, user)
        socket.emit('message', newMessage)
        res.status(201).send( { status: "Success", message: `Mensaje enviado con éxito`, data: newMessage })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const getChatsRealTimeController = async (req, res) => {
    try{
        const messages = await chatService.getAll()
        const reverseMessages = messages.slice().reverse()
        return reverseMessages
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}