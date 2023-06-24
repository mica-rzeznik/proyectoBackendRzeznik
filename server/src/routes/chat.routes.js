import Router from 'express'
const router = Router()
import { getChatSocketController, getChatsController, postChatsController } from '../controllers/chats.controllers.js'
import { passportCall } from '../utils.js'

router.get('/', passportCall('login'), getChatSocketController)
router.post('/', passportCall('login'), postChatsController)

export default router