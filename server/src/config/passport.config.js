import passport from 'passport'
import passportLocal from 'passport-local'
import { cookieExtractor, createHash, isValidPassword, PRIVATE_KEY } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import jwtStrategy from 'passport-jwt'
import UserService from '../services/db/users.services.js'
import CartService from '../services/db/carts.services.js'
import logger from './logger.js'

const JwtStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt
const localStrategy = passportLocal.Strategy
const userService = new UserService()
const cartService = new CartService()

const initializePassport = ()=>{
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.e4467ca5958f22be', 
            clientSecret: '82fb9e65803b187e75f238e161595994fb498763',
            callbackUrl: 'http://localhost:8080/api/jwt/githubcallback'
        }, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await userService.findByUsername(profile._json.email)
                if (!user) {
                    const cart = await cartService.save({})
                    console.log(profile._json)
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '1',
                        age: 18,
                        email: profile._json.email || '1',
                        password: '1',
                        role: 'user',
                        loggedBy: "GitHub",
                        cart: cart,
                        last_connection: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`
                    }
                    const result = await userService.save(newUser)
                    return done(null, result)
                } else {
                    const cart = await cartService.getId(user.cart) || await cartService.save({})
                    await userService.update(user._id, {
                        cart: cart._id,
                        last_connection: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
                    })
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        })
    )
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async(req, username, password, done) =>{
            const { first_name, last_name, email, age, role } = req.body
            try {
                const exists = await userService.findByUsername( email )
                if (exists) {
                    return done(null, false)
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role,
                    loggedBy
                }
                const result = await userService.save(user)
                return done(null, result)
            } catch (error) {
                return done("Error registrando el usuario: " + error)
            }
        }
    ))
    passport.use('login', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async(jwt_payload, done)=>{
            try {
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        })
    )
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userService.findById(id)
            done(null, user)
        } catch (error) {
            logger.error("Error deserializando el usuario: " + error)
        }
    })
}

export default initializePassport