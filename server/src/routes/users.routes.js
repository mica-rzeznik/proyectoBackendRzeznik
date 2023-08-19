import { Router } from 'express'
import { premiumController, userDocuments, deleteUsersController, deleteUserController, getUsersController, getUserController } from '../controllers/users.controllers.js'
import { authorization, passportCall, uploader } from '../utils.js'

const router = Router()

router.put('/premium/:uid', premiumController)
router.delete('/delete', passportCall('jwt'), authorization(['admin']), deleteUsersController)
router.delete('/delete/:uid', passportCall('jwt'), authorization(['admin']), deleteUserController)
router.get("/", passportCall('jwt'), authorization(['admin']), getUsersController)
router.post('/:uid/documents', uploader.any(), userDocuments)
router.get('/:userId', passportCall('jwt'), getUserController)

export default router