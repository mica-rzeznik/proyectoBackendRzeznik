import passport from 'passport'
import passportLocal from 'passport-local'
import { cookieExtractor, createHash, isValidPassword, PRIVATE_KEY } from '../utils.js'
import GitHubStrategy from 'passport-github2'
import jwtStrategy from 'passport-jwt'
import UserService from '../services/db/users.services.js'

const JwtStrategy = jwtStrategy.Strategy
const ExtractJWT = jwtStrategy.ExtractJwt
const localStrategy = passportLocal.Strategy
const userService = new UserService()

const initializePassport = ()=>{
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.e4467ca5958f22be', 
            clientSecret: '82fb9e65803b187e75f238e161595994fb498763',
            callbackUrl: 'http://localhost:8080/api/jwt/githubcallback'
        }, 
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ")
            console.log(profile)
            try {
                const user = await userService.findByUsername(profile._json.email)
                console.log("Usuario encontrado para login:")
                console.log(user)
                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email)
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        role,
                        loggedBy: "GitHub"
                    }
                    const result = await userService.save(newUser)
                    return done(null, result)
                } else {
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
                    console.log("El usuario ya existe.")
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
                // const user = await userService.findByUsername({ email: username })
                // if (!user) {
                //     console.warn("Credenciales incorrectas")
                //     return done(null, false)
                // }
                // if (!isValidPassword(user, password)) {
                //     console.warn("Credenciales incorrectas")
                //     return done(null, false)
                // }
                // return done(null, user)
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
            console.error("Error deserializando el usuario: " + error)
        }
    })
}

export default initializePassport