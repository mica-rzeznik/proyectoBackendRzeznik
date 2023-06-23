import Router from 'express'
const router = Router()
import { getChatsController, postChatsController } from '../controllers/chats.controllers.js'
import { passportCall } from '../utils.js'

router.get('/', passportCall('login'), getChatsController)
router.post('/', passportCall('login'), postChatsController)

export default router