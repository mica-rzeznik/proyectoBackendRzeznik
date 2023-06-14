import Router from 'express'
const router = Router()
import path from 'path'
import __dirname, { authToken, authorization, passportCall } from '../utils.js'
import ioClient from 'socket.io-client'
import { deleteDatosController, getDatosController, getIdDatosController, postDatosController, putDatosController } from '../controllers/products.controllers.js'

import ProductService from "../services/db/products.services.js"
import UserService from "../services/db/users.services.js"

let productService = new ProductService()
const userService = new UserService()
const socket = ioClient('http://localhost:8080')

router.get('/', passportCall('login'), getDatosController)

router.get('/realtimeproducts', async (req, res) => {
    res.render(path.join(__dirname, 'views', 'realTimeProducts'))
})

router.get('/:pid', getIdDatosController)

router.post('/', passportCall('login'), authorization('admin'), postDatosController)

router.put('/:pID', passportCall('login'), authorization('admin'), putDatosController)

router.delete('/:pID', passportCall('login'), authorization('admin'), deleteDatosController)

export default router