// const ProductManager = require("./src/ProductManager.js")
import express from 'express'
import productsRoutes from './src/routes/products.routes.js'
import cartsRoutes from './src/routes/carts.routes.js'

// const productManager = new ProductManager()
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const PORT = 8080

app.get('/', (req, res) => {
    res.send('Hola')
})
app.use('/api/products/', productsRoutes)
app.use('/api/carts/', cartsRoutes)

// app.get('/api/products', async (req, res)=>{
//     const productos = await productManager.getProducts()
//     const limit = req.query.limit || productos.length
//     const productosLimite = productos.slice(0, limit)
//     res.send(productosLimite)
// })
// app.get('/products/:pID', async (req, res)=>{
//     const producto = await productManager.getProductById(req.params.pID)
//     if(producto){
//         res.send(producto)
//     }
//     res.send("producto no encontrado")
// })

app.listen(PORT, ()=>{
    console.log(`acá en el PORT ${PORT}`)
})



// const hacerProducto = async () => {
//     await productManager.addProduct({
//         title: "Bombones explosivos", 
//         description: "Con dinamita sabor coco y chocolate.", 
//         price: 3, 
//         thumbnail: "https://i.imgur.com/3j0QlDV.png", 
//         code: "be", 
//         stock: 8, 
//     });
//     const productos = await productManager.getProducts()
//     console.log(productos)
//     const productoID = await productManager.getProductById(2)
//     console.log(productoID)
//     productManager.deleteProduct(2)
//     productManager.updateProduct(1,{code:"gbbts"})
// }
// hacerProducto()
