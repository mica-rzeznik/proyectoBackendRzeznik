const fs = require ("fs")

class ProductManager {
    products = []
    constructor (title, description, price, thumbnail, code, stock){
        this.products = []
        this.title=title
        this.description=description
        this.price=price
        this.thumbnail=thumbnail
        this.code=code
        this.stock=stock
        this.initID = 1
        this.path = "./Productos.json"
    }
    addProduct = async (producto) => {
        try{
            if(!fs.existsSync(this.path)){
                await fs.promises.writeFile(this.path,"[]")
            }
            for (const item of this.products) {
                if(
                producto.title === "" ||
                producto.description === "" ||
                producto.price === "" ||
                producto.thumbnail === "" ||
                producto.code === "" ||
                producto.stock === ""
                ){
                    return "Por favor, complete todos los campos solicitados."
                }
                else if (producto.code === item.code){
                    return "Ese ítem ya existe"
                }
            }
            const allProducts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const highestId = allProducts.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0)
            producto.id = highestId + 1
            allProducts.push(producto)
            this.products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2))
        }catch(error){
            return "No se pudo agregar el producto"
        }
    }
    getProducts = async () => {
        try {
            return JSON.parse(await fs.promises.readFile(this.path))
        } catch (error) {
            return "No se encontraron productos"
        }
    }
    getProductById = async (id) => {
        try {
            const filtroID = JSON.parse(await fs.promises.readFile(this.path)).find((product) => product.id == id)
            return filtroID ? filtroID : ''
        } catch (error) {
            return "Producto no encontrado"
        }
    }
    updateProduct = async (id, datos) => {
        const existe = await this.getProductById(id)
        let encontrado = await JSON.parse(await fs.promises.readFile(this.path))
        const modificacion = encontrado.map((product) => {
            return id == product.id ? { ...product, ...datos } : product
        })
        const actualizar = await fs.promises.writeFile(this.path, JSON.stringify(modificacion, null, 2))
        existe ? actualizar : console.log("No se pudo actualizar el producto")
    }
    deleteProduct = async (id) => {
        const existe = await this.getProductById(id)
        const encontrado = (await JSON.parse(await fs.promises.readFile(this.path))).filter((product) => product.id !== id)
        const borrar = await fs.promises.writeFile(this.path, JSON.stringify(encontrado, null, 2))
        existe ? borrar : console.log("No se pudo eliminar el producto")
    }
}

module.exports = ProductManager