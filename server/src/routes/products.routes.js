import Router from 'express'
const router = Router()
import path from 'path'
import __dirname, { authToken, authorization, passportCall } from '../utils.js'
import ioClient from 'socket.io-client'
import { deleteDatosController, getDatosController, getIdDatosController, postDatosController, putDatosController } from '../controllers/products.controllers.js'
import errorHandler from '../services/error/middlewares/index.js'
import config from '../config/config.js'

const socket = ioClient(`http://localhost:${config.port}`)

router.get('/', passportCall('jwt'), getDatosController)
router.get('/realtimeproducts', async (req, res) => {
    res.render(path.join(__dirname, 'views', 'realTimeProducts'))
})
router.get('/crear', passportCall('jwt'), authorization(['admin', 'premium']), async (req, res) => {
    res.render(path.join(__dirname, 'views', 'crearProducto'))
})
router.get('/:pid', passportCall('jwt'), getIdDatosController)
router.post('/', passportCall('jwt'), authorization(['admin', 'premium']), postDatosController)
router.put('/:pID', passportCall('jwt'), authorization(['admin', 'premium']),  putDatosController)
router.delete('/:pID', passportCall('jwt'), authorization(['admin', 'premium']), deleteDatosController)

export default router