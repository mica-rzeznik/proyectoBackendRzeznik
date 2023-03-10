const ProductManager = require("./ProductManager.js")
const express = require ("express")

const productManager = new ProductManager()
const app = express()
const PORT = 8080

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req, res)=>{
    const productos = await productManager.getProducts()
    const limit = req.query.limit || productos.length
    const productosLimite = productos.slice(0, limit)
    res.send(productosLimite)
})
app.get('/products/:pID', async (req, res)=>{
    const producto = await productManager.getProductById(req.params.pID)
    if(producto){
        res.send(producto)
    }
    res.send("producto no encontrado")
})

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
