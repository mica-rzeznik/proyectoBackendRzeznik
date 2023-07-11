import mongoose from "mongoose"
import { productModel } from "./models/products.models.js"
import { cartModel } from "./models/carts.models.js"
const ObjectId = mongoose.Types.ObjectId

export default class CartService {
    getAll = async () => {
        let carritos = await cartModel.find()
        return carritos.map(c => c.toObject())
    }
    save = async () => {
        const newCart = await cartModel.create({})
        return newCart
    }
    getIdObject = async (id) => {
        let carrito = await cartModel.findById(id)
        return carrito.toObject()
    }
    getId = async (id) => {
        let carrito = await cartModel.findById(id)
        return carrito
    }
    saveProduct = async (cartId, productId) => {
        const cart = await cartModel.findOne({_id: cartId}).populate("products")
        const product = await productModel.findOne({_id: productId})
        if(!cart){
            return "El carrito no existe"
        }
        if(!product){
            return "El producto no existe"
        }
        if (product.stock <= 0) {
            return "El producto está agotado"
        }
        let productRepe = cart.products.find(p => p.product.equals(productId))
        if (productRepe) {
            productRepe.quantity += 1
            productRepe.partialAmount = productRepe.product.price * productRepe.quantity
        } else {
            cart.products.push({ product: productId, quantity: 1, partialAmount: product.price })
        }
        product.stock -= 1
        await product.save()
        cart.totalAmount = cart.products.reduce((total, p) => total + (p.partialAmount || 0), 0)
        await cart.save()
        const newProduct = await cartModel.findByIdAndUpdate(cartId, { products: cart.products } )
        return newProduct
    }
    deleteProduct = async (cartId, productId) => {
        const cart = await cartModel.findOne({_id: cartId}).populate("products")
        if(!cart){
            return "El carrito no existe"
        }
        let product = cart.products.find(p => p.product.equals(productId))
        const stock = await productModel.findOne({_id: productId})
        if(!product){
            return "El producto no se encuentra en el carrito"
        } else {
            if(product.quantity == 1 ){
                cart.products = cart.products.filter(p => !p.product.equals(productId))
            }else{
                product.quantity -= 1
            }
            await cart.save()
            stock.stock += 1
            await stock.save()
        }
    }
    deleteCart = async (cartId) => {
        const cart = await cartModel.findOne({_id: cartId}).populate("products")
        if(!cart){
            return "El carrito no existe"
        }
        // cart.products = []
        await cart.deleteOne()
    }
}