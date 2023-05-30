import userModel from "../models/users.models.js"

export default class UserService {
    constructor() {
        console.log("Working users with Database persistence in mongodb")
    }
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
    update = async (filter, value) => {
        let result = await userModel.updateOne(filter, value)
        return result
    }
}