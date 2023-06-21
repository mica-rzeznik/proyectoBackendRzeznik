import { Router } from 'express'
import passport from 'passport'
import { githubcallbackController, loginController, logoutController, registerController } from '../controllers/users.controllers.js'

const router = Router()

router.post("/login", loginController)
router.post("/register", registerController)
router.post('/logout', logoutController)
router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {})
router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/github/error'}), githubcallbackController)

export default router