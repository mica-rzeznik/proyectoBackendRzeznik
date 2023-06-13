import { Router } from "express"
import {sendEmail} from '../controllers/email.controllers.js'

const router = Router()

router.get("/", sendEmail)

export default router