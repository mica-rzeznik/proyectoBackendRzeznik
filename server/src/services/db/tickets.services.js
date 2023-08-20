import CartService from './carts.services.js'
import { cartModel } from './models/carts.models.js'
import ticketsModel from './models/tickets.models.js'
import userModel from './models/users.models.js'

const cartService = new CartService()

export default class TicketService {
    getAll = async () => {
        let ticket = await ticketsModel.find()
        return ticket.map(ticket => ticket.toObject())
    }
    getId = async (id) => {
        // const result = await ticketsModel.findOne({ _id: id })
        // return result
        let result = await ticketsModel.findById(id)
        return result
    }
    save = async (cartId, user) => {
        let ticket = await ticketsModel.create({})
        const cart = await cartModel.findOne({_id: cartId})
        console.log(cart.products)
        let result = await ticketsModel.findByIdAndUpdate(ticket._id, {
            purchaser: user.id,
            purchaser_name: user.name,
            purchaser_email: user.email,
            cart: cartId,
            amount: cart.totalAmount,
            products: cart.products
        })
        await cartService.deleteCart(cartId)
        return result
    }
}