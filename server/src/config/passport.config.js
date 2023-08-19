import passport from 'passport'
import { cookieExtractor, PRIVATE_KEY } from '../utils.js'
import jwtStrategy from 'passport-jwt'
import UserService from '../services/db/users.services.js'
import logger from './logger.js'

const JwtStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt
const userService = new UserService()

const initializePassport = ()=>{
    passport.use('jwt', new JwtStrategy(
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