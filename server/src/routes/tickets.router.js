import { Router } from "express"
import { getTickets, getTicketById, saveTicket } from '../controllers/tickets.controller.js'
import { passportCall } from "../utils.js"

const router = Router()
router.get('/', getTickets)
router.get('/', getTicketById)
router.post('/:cid', passportCall('login'), saveTicket)

export default router