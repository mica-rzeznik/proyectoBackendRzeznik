import { Router } from 'express'
import { createHash, generateJWToken, isValidPassword } from '../utils.js'
import passport from 'passport'
import UserService from '../services/db/users.services.js'
import CartService from '../services/db/carts.services.js'
import { cartModel } from '../services/db/models/carts.models.js'
import userModel from '../services/db/models/users.models.js'

const router = Router()
const userService = new UserService()
const cartService = new CartService()

router.post("/login", async (req, res)=>{
    const {email, password} = req.body
    try {
        const user = await userService.findByUsername(email)
        console.log("Usuario encontrado para login:")
        console.log(user)
        if(!user){
            console.warn("User doesn't exists with username: " + email)
            return res.status(204).send({error: "Not found", message: "Usuario no encontrado con username: " + email}) 
        }
        if(!isValidPassword(user, password)){
            console.warn("Invalid credentials for user: " + email)
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
            cart: cart._id
        }
        const access_token = generateJWToken(tokenUser)
        console.log(access_token)
        res.cookie('jwtCookieToken', access_token , {
            maxAge: 60000,
            httpOnly: true
        })
        res.send({message: "Login successful!"})
    } catch (error) {
        console.error(error)
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."})
    }
})
router.post("/register",  async (req, res)=>{
    const { first_name, last_name, email, age, password, role} = req.body
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
    console.log(result)
    res.status(201).send({status: "success", message: "Usuario creado con extito con ID: " + result.id})
})
router.post('/logout', (req, res) => {
    try{
        res.clearCookie('jwtCookieToken')
        res.send('Logout ok!')
    }catch(error){
        return res.json({ status: 'Logout ERROR', body: error })
    }
})
router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), async (req, res) => {
    // const user = req.user
    // req.session.user= {
    //     name : `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age
    // }
    res.redirect("/github")
})

export default router