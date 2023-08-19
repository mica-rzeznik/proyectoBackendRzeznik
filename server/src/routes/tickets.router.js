import { Router } from "express"
import { getTickets, getTicketById, saveTicket } from '../controllers/tickets.controllers.js'
import { passportCall } from "../utils.js"

const router = Router()
router.get('/', getTickets)
router.get('/', getTicketById)
router.post('/:cid', passportCall('jwt'), saveTicket)

export default router