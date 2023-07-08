import userModel from "./models/users.models.js"
import logger from '../../config/logger.js'

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
    update = async (id) => {
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
    updatePassword = async (user, password) => {
        let email = user.email
        console.log(email)
        const userCompleto = await userModel.findOne({email: email})
        console.log(userCompleto)
        const userId = userCompleto._id
        console.log(userId)
        let result = await userModel.findByIdAndUpdate(userId, { password: password })
        return result
    }
}