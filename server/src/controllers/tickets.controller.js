import TicketService from "../services/db/tickets.services.js"

const ticketService = new TicketService()

export const getTickets = async (req, res) => {
    const tickets = await ticketService.getAll()
    res.send({ message: "Success!", payload: tickets })
}
export const getTicketById = async (req, res) => {
    const ticketsId = [await ticketService.getId(req.params.pid)]
    res.send({ message: "Success!", payload: ticketsId })
}
export const saveTicket = async (req, res) => {
    try {
        const ticket = req.body
        const result = await ticketService.save(ticket)
        res.status(201).send({ message: "Success!", payload: result })
    } catch (error) {
        console.error("Hubo un problema creando el ticket.")
        res.status(500).send({ error: error })
    }
}