import {Router} from 'express'

const router = Router()

router.get('/login', (req, res )=>{
    res.render('github-login')
})

router.get('/', (req, res )=>{
    res.redirect('/api/products')
})

router.get('/error', (req, res )=>{
    res.render("error", {error: "Error al autenticarse con GitHub. Intentelo de nuevo."})
})

export default router