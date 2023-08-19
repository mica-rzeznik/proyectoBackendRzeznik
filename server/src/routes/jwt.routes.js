import { Router } from 'express'
import { loginController, logoutController, registerController, changePasswordController, changePasswordEmailController } from '../controllers/users.controllers.js'

const router = Router()

router.post('/login', loginController)
router.post('/register', registerController)
router.post('/logout', logoutController)
router.post('/changePassword/:email', changePasswordEmailController)
router.put('/changePassword', changePasswordController)

export default router