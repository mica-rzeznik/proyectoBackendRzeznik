import { cartModel } from '../db/models/carts.js'
import mongoose from 'mongoose'
import { productModel } from '../db/models/products.js'
const ObjectId = mongoose.Types.ObjectId

class CartService {
    constructor() {
        console.log("Working products with Database persistence in mongodb")
    }

    getAll = async () => {
        let carritos = await cartModel.find()
        return carritos.map(c => c.toObject())
    }
    save = async () => {
        const newCart = await cartModel.create({})
        return newCart
    }
    getId = async (id) => {
        let carrito = await cartModel.findById(id)
        return carrito.toObject()
    }
    saveProduct = async (cartId, productId) => {
        const cart = await cartModel.findOne({_id: cartId}).populate("products")
        if(!cart){
            return "El carrito no existe"
        }
        const product = await productModel.findOne({_id: productId})
        if(!product){
            return "El producto no existe"
        }
        let productRepe = cart.products.find(p => p.product.equals(productId))
        if (productRepe) {
            productRepe.quantity += 1
        } else {
            cart.products.push({product: productId, quantity: 1})
        }
        // cart.products.push({product: productId})
        const newProduct = await cartModel.findByIdAndUpdate(cartId, { products: cart.products } )
        console.log(JSON.stringify(cart, null, '\t'))
        return newProduct
    }
    deleteProduct = async (cartId, productId) => {
        const cart = await cartModel.findOne({_id: cartId}).populate("products")
        if(!cart){
            return "El carrito no existe"
        }
        let product = cart.products.find(p => p.product.equals(productId))
        console.log(product)
        if(!product){
            return "El producto no se encuentra en el carrito"
        } else {
            if(product.quantity == 1 ){
                cart.products = cart.products.filter(p => !p.product.equals(productId))
            }else{
                product.quantity -= 1
            }
            await cart.save()
        }
    }
    deleteCart = async (cartId) => {
        const cart = await cartModel.findOne({_id: cartId}).populate("products")
        if(!cart){
            return "El carrito no existe"
        }
        cart.products = []
        await cart.save()
    }
}
export default CartService