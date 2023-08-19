import Router from 'express'
const router = Router()
import __dirname, { authorization, passportCall } from '../utils.js'
import { deleteDatosController, deleteProductDatosController, getDatosController, getIdDatosController, postDatosController, postProductDatosController } from '../controllers/carts.controllers.js'

// router.use(errorHandler)

router.get('/', passportCall('jwt'), getDatosController)

router.get('/:cID', passportCall('jwt'), getIdDatosController)

router.post('/', postDatosController)

router.post('/:cid/products/:pid', passportCall('jwt'), authorization(['user', 'premium']), postProductDatosController)

router.delete('/:cid/products/:pid', deleteProductDatosController)

router.delete('/:cid', deleteDatosController)

export default router