import { Router } from 'express'
import passport from 'passport'
import userModel from '../dao/db/models/user.models.js'
import { createHash, isValidPassword } from '../utils.js'

const router = Router();

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), async (req, res) => {
    const user = req.user
    req.session.user= {
        name : `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true
    res.redirect("/github")
})

router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    console.log("Registrando nuevo usuario.")
    res.status(201).send({ status: "success", message: "Usuario creado con éxito." })
})
// router.post('/register', async (req, res)=>{
//     const { first_name, last_name, email, age, password, admin} = req.body
//     const exists = await userModel.findOne({email})
//     if (exists){
//         return res.status(400).send({status: "error", message: "Email ya registrado"})
//     }
//     const user = {
//         first_name,
//         last_name,
//         email,
//         age,
//         password: createHash(password),
//         admin
//     }
//     const result = await userModel.create(user)
//     res.status(201).send({status: "success", message: "Usuario creado con éxito con ID: " + result.id})
// })

router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
    console.log("User found to login:")
    const user = req.user
    console.log(user)
    if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" })
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }

    // const access_token = generateJWToken(user)
    // console.log(access_token)
    res.send({ status: "success", payload: req.session.user, message: "¡Primer logueo realizado! :)" })
    // res.send({access_token: access_token})
})
// router.post('/login', async (req, res)=>{
//     const {email, password} = req.body
//     const user = await userModel.findOne({email})
//     if(!user) return res.status(401).send({status:"error",error:"Credenciales incorrectas"})
//     if(!isValidPassword(user,password)){
//         return res.status(401).send({status:"error",error:"Credenciales incorrectas"})
//     }
//     if (user.admin) {
//         req.session.admin = true
//     }
//     req.session.user= {
//         name : `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         age: user.age
//     }
//     // res.send({status:"success", payload:req.session.user, message:"Ingresó correctamente" })
//     res.redirect('/api/products')
// })

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
    if (err) {
        return res.json({ status: 'Logout ERROR', body: err })
    }
    res.send('Logout ok!')
    })
})

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Error en el registro" })
})

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Error en el login" })
})

export default router