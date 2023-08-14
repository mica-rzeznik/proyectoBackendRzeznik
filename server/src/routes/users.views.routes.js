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

router.get('/changePassword', (req, res)=>{
    const email = req.params.email
    res.render('changePassword', {
        email: email
    })
})

router.get('/error', (req, res )=>{
    res.render("error", {error: error.message})
})

router.get("/", passportCall('login'), authorization(['admin']), async (req, res) =>{
    try {
        const usersCompletos = await userService.getAll()
        const users = usersCompletos.map(user => {
            return new UsersDto(user)
        })
        res.render('profiles',{users: users})
    } catch (error) {
        req.logger.error("Error consultando los usuarios")
    }
})

router.get('/:userId', passportCall('login'), async (req, res)=>{
    const userId = req.params.userId
    const userCompleto = await userService.findById(userId)
    const user = new UsersDto(userCompleto)
    res.render('profile',{user: user})
})

export default router