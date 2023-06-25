import {Router} from 'express'
import { passportCall, authorization, authToken } from '../utils.js'
import UserService from '../services/db/users.services.js'
import UsersDto from '../services/dto/user.dto.js'

const router = Router()
const userService = new UserService()

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

router.get('/', passportCall('login'), authorization('user'), (req, res)=>{
    const user = new UsersDto(req.user)
    res.render('profile',{user: user})
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

router.get('/private', passportCall('login'), authorization('admin'),  (req, res)=>{
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
        req.logger.error("Error consultando el usuario con ID: " + userId)
    }
})

export default router