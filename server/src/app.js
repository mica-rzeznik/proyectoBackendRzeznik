import express from 'express'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import initializePassport from '../src/config/passport.config.js'
import productsRoutes from '../src/routes/products.routes.js'
import cartsRoutes from '../src/routes/carts.routes.js'
import usersViewsRoutes from '../src/routes/users.views.routes.js'
import jwtRouter from '../src/routes/jwt.routes.js'
import usersRoutes from '../src/routes/users.routes.js'
import ticketsRouter from './routes/tickets.router.js'
import emailRouter from './routes/email.routes.js'
import mockingRouter from './routes/mocking.router.js'
import chatRouter from './routes/chat.routes.js'
import loggerRouter from './routes/logger.routes.js'
import config from '../src/config/config.js'
import cors from 'cors'
import MongoSingleton from './config/mongodb-singleton.js'
import compression from 'express-compression'
import ChatService from './services/db/chats.services.js'
import logger, { addLogger } from './config/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'

const app = express()
const PORT = config.port
const DB = config.mongoUrl

const swaggerOptions ={
    definition:{
        openapi: '3.0.0',
        info:{
            title:'Documentación',
            description:'Comprar y vender golosinas mágicas'
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/api/docs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(addLogger)
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

export const httpServer = app.listen(PORT, ()=>{
    logger.debug(`acá en el PORT ${PORT}`)
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
app.use(compression())
app.use('/api/products/', productsRoutes)
app.use('/api/carts/', cartsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/jwt', jwtRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/email', emailRouter)
app.use('/mockingproducts', mockingRouter)
app.use('/users', usersViewsRoutes)
app.use('/chat', chatRouter)
app.use('/loggerTest', loggerRouter)
const chatService = new ChatService()
socketServer.on('connection', async (socket) => {
    logger.debug("Nuevo cliente conectado")
    try {
        socket.on('message', data => {
            socketServer.emit('messageLogs', data)
        })
    } catch (error) {
        logger.error('Error al obtener los mensajes:', error)
    }
})

const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance()
    } catch (error) {
        logger.error(error)
    }
}
mongoInstance()