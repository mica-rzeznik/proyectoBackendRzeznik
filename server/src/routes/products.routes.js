import Router from 'express'
const router = Router()
import path from 'path'
import __dirname, { authToken, authorization, passportCall } from '../utils.js'
import ioClient from 'socket.io-client'
import { deleteDatosController, getDatosController, getIdDatosController, postDatosController, putDatosController } from '../controllers/products.controllers.js'
import errorHandler from '../services/error/middlewares/index.js'

const socket = ioClient('http://localhost:8080')

// router.use(errorHandler)

router.get('/', passportCall('login'), getDatosController)

router.get('/realtimeproducts', async (req, res) => {
    res.render(path.join(__dirname, 'views', 'realTimeProducts'))
})

router.get('/crear', passportCall('login'), authorization(['admin', 'premium']), async (req, res) => {
    res.render(path.join(__dirname, 'views', 'crearProducto'))
})

router.get('/:pid', /*passportCall('login'),*/ getIdDatosController)

router.post('/', /*passportCall('login'), authorization(['admin', 'premium']),*/ postDatosController)

router.put('/:pID', passportCall('login'), authorization(['admin', 'premium']),  putDatosController)

router.delete('/:pID', /*passportCall('login'), authorization(['admin', 'premium']),*/ deleteDatosController)

export default router