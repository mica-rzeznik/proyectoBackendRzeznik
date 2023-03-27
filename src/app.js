import express from 'express'
import productsRoutes from './routes/products.routes.js'
import cartsRoutes from './routes/carts.routes.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import path from 'path'
import products from '../src/Productos.json' assert { type: "json" }

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))
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

app.use(express.static(path.join(__dirname, 'public')))


const httpServer = app.listen(PORT, ()=>{
    console.log(`acá en el PORT ${PORT}`)
})

app.get('/', (req, res) => {
    res.send('Hola')
})
app.use('/api/products/', productsRoutes)
app.use('/api/carts/', cartsRoutes)

const socketServer = new Server(httpServer)
socketServer.on('connection', socket =>{
    console.log("Nuevo cliente conectado")
    socket.emit('new-product', {products})
})