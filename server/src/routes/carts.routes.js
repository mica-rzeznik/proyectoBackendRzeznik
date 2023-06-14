import Router from 'express'
const router = Router()
import path from 'path'
import __dirname, { authorization, passportCall } from '../utils.js'
import ioClient from 'socket.io-client'
import { deleteDatosController, deleteProductDatosController, getDatosController, getIdDatosController, postDatosController, postProductDatosController } from '../controllers/carts.controllers.js'

router.get('/', passportCall('login'), getDatosController)

router.get('/:cID', getIdDatosController)

router.post('/', postDatosController)

router.post('/:cid/products/:pid', passportCall('login'), authorization('user'), postProductDatosController)

router.delete('/:cid/products/:pid', deleteProductDatosController)

router.delete('/:cid', deleteDatosController)

export default router