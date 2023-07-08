import { Router } from 'express'
import passport from 'passport'
import { githubcallbackController, loginController, logoutController, registerController, changePasswordController, premiumController } from '../controllers/users.controllers.js'
import { passportCall } from '../utils.js'

const router = Router()

router.post('/login', loginController)
router.post('/register', registerController)
router.post('/logout', logoutController)
router.put('/changePassword',passportCall('login'), changePasswordController)
router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/github/error'}), githubcallbackController)
router.put('/premium/:uid', premiumController)

export default router