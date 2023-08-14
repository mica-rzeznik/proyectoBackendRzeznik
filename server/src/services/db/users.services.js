import userModel from "./models/users.models.js"
import logger from '../../config/logger.js'
import mongoose from "mongoose"
const ObjectId = mongoose.Types.ObjectId

export default class UserService {
    getAll = async () => {
        let users = await userModel.find()
        return users.map(user=>user.toObject())
    }
    save = async (user) => {
        let result = await userModel.create(user)
        return result
    }
    findByUsername = async (username) => {
        const result = await userModel.findOne({email: username})
        return result
    }
    findById = async (id) => {
        const result = await userModel.findById(id)
        return result
    }
    update = async (id, parameter) => {
        const result = await userModel.findByIdAndUpdate(id, parameter)
        return result
    }
    updateRol = async (id) => {
        const user = await userModel.findById(id)
        if(user.role == 'premium'){
            const result = await userModel.findByIdAndUpdate(id, {role: 'user'})
            logger.info('Usuario cambiado a user')
            return result
        }else if (user.role == 'user'){
            const result = await userModel.findByIdAndUpdate(id, {role: 'premium'})
            logger.info('Usuario cambiado a premium')
            return result
        }else{
            logger.warning('Usuario no era ni premium ni user')
            throw new Error('Usuario no era ni premium ni user')
        }
    }
    updatePassword = async (email, password) => {
        const userCompleto = await userModel.findOne({email: email})
        const userId = userCompleto._id
        let result = await userModel.findByIdAndUpdate(userId, { password: password })
        return result
    }
    uploadDocuments = async (files, userId) => {
        const user = await userModel.findByIdAndUpdate(userId, { documents: files})
        return user
    }
    getOldUsers = async () => {
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - 1)
        const formattedCurrentDate = `${currentDate.toLocaleDateString()} - ${currentDate.toLocaleTimeString()}`
        const oldUsers = await userModel.find({
            last_connection: { $lt: formattedCurrentDate },
            role: { $ne: 'admin' }
        })
        return oldUsers
    }
    deleteUser = async (id) => {
        if (!ObjectId.isValid(id)) {
            throw new Error(`ID de usuario inválido: ${id}`)
        }
        const user = await userModel.findById(id)
        if(user.role != 'admin'){
            try {
                const result = await userModel.findByIdAndDelete(new ObjectId(id))
                if (result === null) {
                    throw new Error(`No se pudo eliminar el usuario con id ${id}`)
                }
            } catch (error) {
                throw new Error(`Error al eliminar el usuario con id ${id}: ${error.message}`)
            }
        }else{
            throw new Error('Usuario no era ni premium ni user')
        }
    }
}