import Router from 'express'
const router = Router()
import { getChatSocketController, postChatsController } from '../controllers/chats.controllers.js'
import { passportCall } from '../utils.js'

router.get('/',passportCall('jwt'), getChatSocketController)
router.post('/',passportCall('jwt'), postChatsController)

export default router