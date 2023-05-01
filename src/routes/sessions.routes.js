import { Router } from 'express';
import userModel from '../dao/db/models/user.models.js';

const router = Router();

router.post('/register', async (req, res)=>{
    const { first_name, last_name, email, age, password, admin} = req.body
    const exists = await userModel.findOne({email})
    if (exists){
        return res.status(400).send({status: "error", message: "Email ya registrado"})
    }
    const user = {
        first_name,
        last_name,
        email,
        age,
        password,
        admin
    }
    const result = await userModel.create(user)
    res.status(201).send({status: "success", message: "Usuario creado con éxito con ID: " + result.id})
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email,password})
    if(!user) return res.status(401).send({status:"error",error:"Usuario no registrado. Si no está registrado, cree una cuenta"})
    if (user.admin) {
        req.session.admin = true
    }
    req.session.user= {
        name : `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }
    // res.send({status:"success", payload:req.session.user, message:"Ingresó correctamente" })
    res.redirect('/api/products')
})

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
    if (err) {
        return res.json({ status: 'Logout ERROR', body: err })
    }
    res.send('Logout ok!')
    })
})

export default router