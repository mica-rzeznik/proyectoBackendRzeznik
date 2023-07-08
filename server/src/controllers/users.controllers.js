import path from "path"
import { Router } from 'express'
import __dirname, { createHash, generateJWToken, isValidPassword } from '../utils.js'
import UserService from '../services/db/users.services.js'
import CartService from '../services/db/carts.services.js'
import { cartModel } from '../services/db/models/carts.models.js'
import userModel from '../services/db/models/users.models.js'
import CustomError from "../services/error/CustomError.js"
import EErrors from "../services/error/errors-enum.js"
import { createUserErrorInfo } from '../services/error/messages/user-creation-error.message.js'

const userService = new UserService()
const cartService = new CartService()

export const loginController = async (req, res)=>{
    const {email, password} = req.body
    try {
        const user = await userService.findByUsername(email)
        if(!user){
            return res.status(204).send({error: "Not found", message: "Usuario no encontrado con username: " + email}) 
        }
        if(!isValidPassword(user, password)){
            return res.status(401).send({status:"error",error:"El usuario y la contraseña no coinciden!"})
        }
        const cartAnterior = await cartModel.findOne({_id: user.cart})
        const cart = cartAnterior || await cartService.save({})
        await userModel.findByIdAndUpdate(user._id, {
            cart: cart._id,
        })
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: cart._id, 
            id: user._id,
            rol: user.role
        }
        const access_token = generateJWToken(tokenUser)
        res.cookie('jwtCookieToken', access_token , {
            // maxAge: 1000000,
            httpOnly: true
        })
        res.send({message: "Login successful!"})
    } catch (error) {
        req.logger.error(error)
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."})
    }
}

export const registerController = async (req, res)=>{
    try{
        const { first_name, last_name, email, age, password, role} = req.body
        if (!first_name || !last_name || !email || !age || !password) {
            CustomError.createError({
                name: "Create User Error",
                cause: createUserErrorInfo(first_name,last_name,email,age,password),
                message: "Error tratando de crear al usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        const exists = await userService.findByUsername(email)
        const cart = await cartService.save({})
        if (exists){
            return res.status(401).send({status: "error", message: "Usuario ya existe."})
        }
        let user = await userService.save({})
        let result = await userModel.findByIdAndUpdate(user._id, {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role,
            cart: cart._id,
            loggedBy: 'Registrado tradicionalmente'
        })
        res.status(201).send({status: "success", message: "Usuario creado con extito con ID: " + result.id})
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const logoutController = (req, res) => {
    try{
        res.clearCookie('jwtCookieToken')
        res.send('Logout ok!')
    }catch(error){
        return res.json({ status: 'Logout ERROR', body: error })
    }
}

export const changePasswordController = async (req, res) => {
    try{
        let user = req.user
        console.log(user)
        let { newPassword, newPassword2 } = req.body
        console.log(newPassword)
        if(newPassword != newPassword2){
            console.log('contraseñas iguales')
            return res.status(401).send({status:"error",error:"Las contraseñas no coinciden"})
        }
        if(isValidPassword(user, newPassword)){
            console.log('acá está el problema creo')
            return res.status(401).send({status:"error",error:"La contraseña nueva no puede ser la misma que la anterior"})
        }
        console.log('llegamos acá?')
        const passwordActualizada = await userService.updatePassword(user, newPassword)
        res.status(200).send({ status: "Success", message: "Contraseña actualizada.", data: passwordActualizada })
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}

export const githubcallbackController =  async (req, res) => {
    // const user = req.user
    // req.session.user= {
    //     name : `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age
    // }
    res.redirect("/github")
}

export const premiumController = async (req, res) => {
    try{
        let userId = req.params.uid
        await userService.update(userId)
        res.send('Rol del usuario cambiado')
    }catch(error){
        res.status(500).send({ status: "Error", message: error.message, cause: error.cause })
    }
}