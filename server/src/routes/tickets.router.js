import { Router } from "express"
import { getTickets, getTicketById, saveTicket } from '../controllers/tickets.controller.js'

const router = Router()
router.get('/', getTickets)
router.get('/', getTicketById)
router.post('/:cid', saveTicket)

export default router