import Router from 'express'
const router = Router()
import path from 'path'
import __dirname from '../utils.js'
import ioClient from 'socket.io-client'
import { deleteDatosController, getDatosController, getIdDatosController, postDatosController, putDatosController } from '../controllers/products.controllers.js'

const socket = ioClient('http://localhost:8080')

router.get('/', getDatosController)

router.get('/realtimeproducts', async (req, res) => {
    res.render(path.join(__dirname, 'views', 'realTimeProducts'))
})

router.get('/:pid', getIdDatosController)

router.post('/', postDatosController)

router.put('/:pID', putDatosController)

router.delete('/:pID', deleteDatosController)

export default router