import ticketsModel from './models/tickets.models.js'

export default class TicketService {
    getAll = async () => {
        let ticket = await ticketsModel.find()
        return orders.map(order => order.toObject())
    }
    save = async (ticket) => {
        let result = await ticketsModel.create(ticket)
        return result
    }
    getById = async (id) => {
        const result = await ticketsModel.findOne({ _id: id })
        return result
    }
}