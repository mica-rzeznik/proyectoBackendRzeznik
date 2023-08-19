import {Router} from 'express'

const router = Router()

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

export default router