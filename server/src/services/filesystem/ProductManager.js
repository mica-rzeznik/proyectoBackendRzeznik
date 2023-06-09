import fs from 'fs'

class ProductManager {
    constructor (title, description, price, status, thumbnail, code, stock, category){
        this.products = []
        this.title=title
        this.description=description
        this.price=price
        this.status=status
        this.thumbnail=thumbnail
        this.code=code
        this.stock=stock
        this.category=category
        this.path = "./src/dao/filesystem/files/Productos.json"
    }
    save = async (producto) => {
        try{
            if(!fs.existsSync(this.path)){
                await fs.promises.writeFile(this.path,"[]")
            }
            if(
            producto.title === "" ||
            producto.description === "" ||
            producto.price === "" ||
            producto.thumbnail === "" ||
            producto.code === "" ||
            producto.stock === ""
            ){
                throw new Error("Por favor, complete todos los campos solicitados.")
            }
            const allProducts = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
            const productExists = allProducts.some((p) => p.code === producto.code)
            if (productExists) {
                throw new Error("El producto ya existe. No se puede agregar.")
            }
            const highestId = allProducts.reduce((acc, curr) => curr.id > acc ? curr.id : acc, 0)
            producto.id = highestId + 1
            allProducts.push(producto)
            this.products.push(producto)
            await fs.promises.writeFile(this.path, JSON.stringify(allProducts, null, 2))
        }catch(error){
            if(!error.message){
                throw new Error("No se pudo agregar el producto.")
            }
            throw new Error(error.message)
        }
    }
    getAll = async () => {
        try {
            return JSON.parse(await fs.promises.readFile(this.path))
        } catch (error) {
            throw new Error("No se encontraron productos")
        }
    }
    getId = async (id) => {
        const filtroID = JSON.parse(await fs.promises.readFile(this.path)).find((p) => p.id == id)
        if(!filtroID){
            throw new Error("Producto no encontrado")
        }
        return filtroID
    }
    update = async (id, datos) => {
        try{
            const existe = await this.getProductById(id)
        if(!existe){
            throw new Error("Producto no encontrado." )
        }
        let encontrado = await JSON.parse(await fs.promises.readFile(this.path))
        const modificacion = encontrado.map((product) => {
            return id == product.id ? { ...product, ...datos } : product
        })
        await fs.promises.writeFile(this.path, JSON.stringify(modificacion, null, 2))
        }catch(error){
            if(!error.message){
                throw new Error("No se pudo actualizar el producto")
            }
            throw new Error(error.message)
        }
    }
    delete = async (id) => {
        const productsSize = JSON.parse(await fs.promises.readFile(this.path, 'utf-8')).length
        const existe = await this.getProductById(id)
        if (!existe) {
            throw new Error("Producto no encontrado." )
        }
        const encontrado = (await JSON.parse(await fs.promises.readFile(this.path))).filter((p) => p.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(encontrado, null, 2))
        const listaActual = JSON.parse(await fs.promises.readFile(this.path, 'utf-8'))
        if (listaActual.length === productsSize) {
            throw new Error("El producto no se pudo borrar." )
        }
    }
}

export default ProductManager