import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import products from './services/filesystem/files/Productos.json' assert { type: "json" }
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from '../src/config/passport.config.js'
import productsRoutes from '../src/routes/products.routes.js'
import cartsRoutes from '../src/routes/carts.routes.js'
import usersViewsRoutes from '../src/routes/users.views.routes.js'
import sessionsRoutes from '../src/routes/sessions.routes.js'
import githubLoginViewRouter from '../src/routes/github-login.views.router.js'
import jwtRouter from '../src/routes/jwt.routes.js'
import ticketsRouter from './routes/tickets.router.js'
import emailRouter from './routes/email.routes.js'
import mockingRouter from './routes/mocking.router.js'
import config from '../src/config/config.js'
import cors from 'cors'
import MongoSingleton from './config/mongodb-singleton.js'

const app = express()
const PORT = config.port
const DB = config.mongoUrl
console.log(config)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
// lo estoy haciendo así porque al hacerlo como lo vimos en clase me saltaba el error Error: Failed to lookup view "index" in views directory "C:\Users\micar\Desktop\Full Stack\Backend\proyectoBackendRzeznik\views" y aunque modificaba el app.set, seguía dirigiendose a la ruta incorrecta sin pasar por src
app.engine('handlebars', handlebars.engine({
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    defaultLayout: 'main'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')
// app.engine('handlebars', handlebars.engine())
// app.set('views', __dirname + 'views')
// app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, '../../client')))
app.use('/css', express.static(path.join(__dirname, 'client', 'css')))
app.use('/js', express.static(path.join(__dirname, 'client', 'js')))

app.use(cookieParser('CoderS3cr3tC0d3'))

const httpServer = app.listen(PORT, ()=>{
    console.log(`acá en el PORT ${PORT}`)
})
const socketServer = new Server(httpServer)

app.use(session({
    store: MongoStore.create({
        mongoUrl: DB,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 40
    }),
    secret:"CoderS3cret",
    resave: false,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
// app.use(passport.session())

app.get('/', (req, res) => {
    res.redirect('/users/login')
})
app.use('/api/products/', productsRoutes)
app.use('/api/carts/', cartsRoutes)
app.use('/users', usersViewsRoutes)
// app.use('/api/sessions', sessionsRoutes)
app.use('/github', githubLoginViewRouter)
app.use('/api/jwt', jwtRouter)
app.use('/api/tickets', ticketsRouter)
app.use("/api/email", emailRouter)
app.use('/mockingproducts', mockingRouter)

socketServer.on('connection', socket =>{
    console.log("Nuevo cliente conectado")
    socket.emit('new-product', {products})
})


const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        console.error(error)
    }
}
mongoInstance()

// const connectMongoDB = async ()=>{
//     try {
//         await mongoose.connect(DB)
//         console.log("Conectado con éxito a MongoDB usando Moongose.")
//     } catch (error) {
//         console.error("No se pudo conectar a la BD usando Moongose: " + error)
//         process.exit()
//     }
// }
// connectMongoDB()