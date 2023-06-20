import path from "path";
import __dirname, { generateProducts } from "../utils.js";

export const getDatosController = async (req, res) => {
    try {
        let products = []
        for (let i = 0; i < 100; i++) {
            products.push(generateProducts())
        }
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const paginatedProducts = products.slice(startIndex, endIndex)
        const totalPages = Math.ceil(products.length / limit)
        const hasPrevPage = (page - 1 <= 0)? false : true
        const prevPage = page - 1
        const hasNextPage = endIndex < products.length
        const nextPage = page + 1
        const prevLink = hasPrevPage ? `http://localhost:8080/mockingproducts?page=${prevPage}` : ''
        const nextLink = hasNextPage ? `http://localhost:8080/mockingproducts?page=${nextPage}` : ''
        res.render(path.join(__dirname, 'views', 'products'), {
            products: paginatedProducts,
            page: page,
            // hasNextPage: result.hasNextPage,
            // nextPage: result.nextPage,
            // hasPrevPage: result.hasPrevPage,
            // prevPage: result.prevPage,
            // totalPages: result.totalPages,
            hasPrevPage: hasPrevPage,
            prevPage: prevPage,
            hasNextPage: hasNextPage,
            nextPage: nextPage,
            totalPages: totalPages,
            prevLink: prevLink,
            nextLink: nextLink,
            // isValid: result.isValid,
            currentPage: page,
            // user: req.user
        })
        // res.send({ status: "success", payload: products })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: error, message: "No se pudo obtener los fake products" })
    }
}