import chai from "chai"
import supertest from 'supertest'
//----------------------------
// funciona en entorno --mode testing
// ---------------------------
const expect = chai.expect

const requester = supertest("http://localhost:7070")

describe("Testing Honeydukes App", () => {
    describe("Testing Users Api", () => {
        before(function () {
            this.cookie
            // hay que borrar el usuario ya creado o cambiarle los datos del mail para que no sale error
            this.mockUser = {
                role: "premium",
                age: 25,
                email: "hedwig@gmail.com",
                first_name: "Harry",
                last_name: "Potter",
                password: "1234"
            }
        })
        it("El usuario se debe poder registrar correctamente: se le asigna un carrito y se hashea su contraseña", async function () {
            //Given
            //Then
            const { _body } = await requester.post('/api/jwt/register').send(this.mockUser)
            //Assert that
            expect(_body.data._id).to.be.ok
            expect(_body.data.cart).is.not.empty
            expect(_body.data.password).is.not.equal(this.mockUser.password)
        })
        it("Se debe poder hacer login con los datos del usuario y se debe generar una cookie", async function () {
            //Given:
            const mockLogin = {
                email: this.mockUser.email,
                password: this.mockUser.password
            }
            //Then: 
            const result = await requester.post('/api/jwt/login').send(mockLogin)
            const cookieResult = result.headers['set-cookie'][0]
            const cookieData = cookieResult.split('=')
            this.cookie = {
                name: cookieData[0],
                value: cookieData[1]
            }
            //Assert that:
            expect(this.cookie.name).to.be.ok.and.eql('jwtCookieToken')
            expect(this.cookie.value).is.not.empty
        })
    })
    describe("Testing Products Api", () => {
        before(
            async function() {
            this.admin = { email: 'adminCoder@coder.com', password: 'adminCod3r123'}
            const { headers } = await requester.post('/api/jwt/login').send(this.admin)
            this.cookie = headers['set-cookie'][0]
        })
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
            const { _body } = await requester.post("/api/products").send(this.product).set('Cookie', this.cookie)
            console.log(_body.message)
            this._id = _body.data._id
            //Assert that
            expect(_body.status).is.equal("Success")
        })
        it("No se deben poder crear productos duplicados", async function () {
            //Given
            //Then
            const { _body } = await requester.post("/api/products").send(this.product).set('Cookie', this.cookie)
            //Assert that
            expect(_body.message).contains("duplicate key error")
        })
        it("No se deben poder crear productos si le faltan datos requeridos", async function () {
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
            const { _body } = await requester.post("/api/products").send(product2).set('Cookie', this.cookie)
            //Assert that
            expect(_body.cause).contains("incompletas")
        })
        it("Los productos se deben eliminar correctamente", async function () {
            //Given
            console.log(`Eliminando producto con el id:${this._id}`)
            //Then
            const { _body } = await requester.delete(`/api/products/${this._id}`).set('Cookie', this.cookie)
            //Assert that
            expect(_body.message).contains("Producto eliminado.")
        })
    })
    describe("Testing Carts Api",  () => {
        before(
            async function() {
            this.bobEsponja = { email: 'gary@gmail.com', password: '1234'}
            const { headers } = await requester.post('/api/jwt/login').send(this.bobEsponja)
            this.cookie = headers['set-cookie'][0]
        })
        beforeEach(function () {
            this.cart
            this.productID = "64c2f420ceb66ae9699943f7"
        })
        it("Crear un carrito correctamente", async function () {
            //Given
            //Then
            const result = await requester.post("/api/carts").set('Cookie', this.cookie)
            this.cart = result._body.data
            console.log(this.cart._id)
            //Assert that
            expect(this.cart._id).is.ok
        })
        it("Agregar productos al carrito correctamente", async function () {
            //Given
            const emptyArray = []
            //Then
            const result = await requester.post(`/api/carts/${this.cart._id}/products/${this.productID}`).set('Cookie', this.cookie)
            this.cart = result._body.data
            //Assert that
            expect(this.cart.products).is.not.deep.equal(emptyArray)
        })
        it("Al agregar más productos al carrito se debe aumentar el precio total", async function () {
            //Given
            const precioInicial = this.cart.totalAmount
            //Then
            const result = await requester.post(`/api/carts/${this.cart._id}/products/${this.productID}`).set('Cookie', this.cookie)
            this.cart = result._body.data
            console.log(`Total anterior: ${precioInicial}, total actual: ${this.cart.totalAmount}`)
            //Assert that
            expect(this.cart.totalAmount).is.not.equal(precioInicial)
        })
    })
})


// // // Usuarios ficticios creados para las pruebas
// // this.mockUser = {
// //     role: "admin",
// //     age: 25,
// //     email: "adminCoder@coder.com",
// //     first_name: "admin",
// //     last_name: "admin",
// //     password: "adminCod3r123"
// // }
// // this.mockUser = {
// //     role: "premium",
// //     age: 25,
// //     email: "gary@gmail.com",
// //     first_name: "Bob",
// //     last_name: "Esponja",
// //     password: "adminCod3r123"
// // }