import {Router} from 'express'
const router = Router()

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

router.get('/', (req, res)=>{
    res.render('profile', {
        user: req.session.user
    })
})

// usuario admin: adminCoder@coder.com
// contraseña: adminCod3r123

function auth(req, res, next){
    if(req.session.admin){
        return next()
    }else{
        return res.status(403).send('Usuario no autorizado para ingresar al recurso')
    }
}

router.get('/private', auth,  (req, res)=>{
    res.send("Esto solo lo ve el admin")
})

router.get('/error', (req, res )=>{
    res.render("error", {error: "Hubo un error."})
})

export default router