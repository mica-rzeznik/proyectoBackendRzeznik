import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { faker } from '@faker-js/faker'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
faker.locale = 'es'

export default __dirname

export const generateProducts = () => {
    const categoriaAleatoria = () => {
        const categorias = ['golosinas', 'chocolate', 'pastelería', 'azucarados']
        const i = Math.floor(Math.random() * categorias.length)
        return categorias[i]
    }
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.image(),
        code: faker.lorem.word(),
        stock: faker.random.numeric(1),
        category: categoriaAleatoria(),
        id: faker.database.mongodbObjectId()
    }
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (user, password )=>{
    return bcrypt.compareSync(password, user.password)
}

export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT"

export const generateJWToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '60s'})
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({error: "User not authenticated or missing token."})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: "Token invalid, Unauthorized!"})
        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                return res.status(401).send({error: info.messages?info.messages:info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")
        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.")
        }
        next()
    }
}

export const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies['jwtCookieToken']
    }
    return token
}