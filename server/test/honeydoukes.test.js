import chai from "chai"
import supertest from 'supertest'
import { productModel } from "../src/services/db/models/products.models.js"
import ProductService from "../src/services/db/products.services.js"
import mongoose from "mongoose"
import { cartModel } from "../src/services/db/models/carts.models.js"
import CartService from "../src/services/db/carts.services.js"
//funciona en entorno testing
const expect = chai.expect

const requester = supertest("http://localhost:7070")

describe("Testing Honeydukes App", () => {
    // describe("Testing Users Api", () => {
    //     before(function () {
    //         this.cookie
    //         this.mockUser = {
    //             // first_name: "Prueba1",
    //             // last_name: "Prueba1",
    //             // email: "prueba@gmail.com",
    //             // password: "1234",
    //             // age: 26
    //             role: "premium",
    //             age: 25,
    //             cart: "64950ba3c0fba835c90743e6",
    //             email: "charles.16@gmail.com",
    //             first_name: "Charles",
    //             last_name: "Leclerc",
    //             loggedBy: "Registrado tradicionalmente",
    //             password: "1234"
    //         }
    //     })
    //     it("El usuario se debe poder registrar correctamente", async function (){
    //         const { statusCode, ok, _body } = await requester.post('/api/jwt/register').send(this.mockUser);
    //         console.log(_body)
    //     })
    // })
    describe("Testing Products Api", () => {
        beforeEach(function () {
            this.product = {
                title: "Paletas con sabor a sangre",
                description: "La favorita de los vampiros.",
                price: 3,
                status: true,
                thumbnail: "https://i.imgur.com/6sqYSSA.jpeg",
                code: "pss",
                stock: 13,
                category: "golosinas"
            }
            this._id
        })
        it("Los productos se deben crear correctamente", async function () {
            //Given
            //Then
            const { _body, ok, statusCode } = await requester.post("/api/products").send(this.product)
            console.log(_body.message)
            this._id = _body.data._id
            //Assert that
            expect(_body.status).is.equal("Success")
        })
        it("No se deben poder crear productos duplicados", async function () {
            //Given
            //Then
            const { _body, ok, statusCode } = await requester.post("/api/products").send(this.product)
            //Assert that
            expect(_body.message).contains("duplicate key error")
        })
        it("No se deben poder crear productos si le faltan datos requeridos", async ()=>{
            //Given
            const product2 = {
                title: "Paleta ácida",  
                price: 3, 
                status: true, 
                thumbnail: "https://i.imgur.com/ZcSj6NS.png", 
                code: "pa", 
                stock: 28, 
                category: "golosinas"
            }
            //Then
            const { _body, ok, statusCode } = await requester.post("/api/products").send(product2)
            //Assert that
            expect(_body.cause).contains("incompletas")
        })
        it("Los productos se deben eliminar correctamente", async function () {
            //Given
            console.log(`Eliminando producto con el id:${this._id}`)
            //Then
            const { _body, ok, statusCode } = await requester.delete(`/api/products/${this._id}`)
            //Assert that
            expect(_body.message).contains("Producto eliminado.")
        })
    })
    describe("Testing Carts Api",  () => {
        beforeEach(function () {
            this.cart
            this.productID = "64c2f420ceb66ae9699943f7"
            this.cartService = new CartService()
        })
        it("Crear un carrito correctamente", async function () {
            //Given
            //Then
            const result = await requester.post("/api/carts")
            this.cart = result._body.data
            console.log(this.cart._id)
            //Assert that
            expect(this.cart._id).is.ok
        })
        it("Agregar productos al carrito correctamente", async function () {
            //Given
            const emptyArray = []
            //Then
            const result = await requester.post(`/api/carts/${this.cart._id}/products/${this.productID}`)
            this.cart = result._body.data
            //Assert that
            expect(this.cart.products).is.not.deep.equal(emptyArray)
        })
        it("Al agregar más productos al carrito se debe aumentar el precio total", async function () {
            //Given
            const precioInicial = this.cart.totalAmount
            //Then
            const result = await requester.post(`/api/carts/${this.cart._id}/products/${this.productID}`)
            this.cart = result._body.data
            console.log(`Total anterior: ${precioInicial}, total actual: ${this.cart.totalAmount}`)
            //Assert that
            expect(this.cart.totalAmount).is.not.equal(precioInicial)
        })
    })
})