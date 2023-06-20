import Router from 'express'
const router = Router()
import { getDatosController } from '../controllers/mocking.controllers.js'

router.get('/', getDatosController)

export default router