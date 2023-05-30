import {Router} from 'express'
import { passportCall, authorization, authToken } from '../utils.js'
import UserService from '../services/users.services.js'

const router = Router()
const userService = new UserService()

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

router.get('/', (req, res)=>{
    passportCall('jwt'),
    authorization('user'),
    (req, res)=>{
        res.render('profile',{user: req.user})
    }
})

// usuario admin: adminCoder@coder.com
// contraseña: adminCod3r123

function auth(req, res, next){
    if(req.user.role=="admin"){
        return next()
    }else{
        return res.status(403).render("error", {error:'Usuario no autorizado para ingresar al recurso'})
    }
}

router.get('/private', auth,  (req, res)=>{
    res.send("Esto solo lo ve el admin")
})

router.get('/error', (req, res )=>{
    res.render("error", {error: error.message})
})

router.get("/:userId", authToken, async (req, res) =>{
    const userId = req.params.userId
    try {
        const user = await userService.findById(userId)
        if (!user) {
            res.status(202).json({message: "User not found with ID: " + userId})
        }
        res.json(user)
    } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId)
    }
})

export default router