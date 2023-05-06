import passport from 'passport'
import passportLocal from 'passport-local'
import userModel from '../dao/db/models/user.models.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'


const localStrategy = passportLocal.Strategy

const initializePassport = ()=>{
    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.e4467ca5958f22be', 
            clientSecret: '82fb9e65803b187e75f238e161595994fb498763',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback'
        }, 
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ")
            console.log(profile)
            try {
                const user = await userModel.findOne({email: profile._json.email})
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
                        loggedBy: "GitHub"
                    }
                    const result = await userModel.create(newUser)
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
            const { first_name, last_name, email, age, admin } = req.body
            try {
                const exists = await userModel.findOne({ email })
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
                    admin
                }
                const result = await userModel.create(user)
                return done(null, result)
            } catch (error) {
                return done("Error registrando el usuario: " + error)
            }
        }
    ))
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                console.log("Usuario encontrado para login:")
                console.log(user)
                if (!user) {
                    console.warn("Credenciales incorrectas")
                    return done(null, false)
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Credenciales incorrectas")
                    return done(null, false)
                }
                return done(null, user)
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
            let user = await userModel.findById(id)
            done(null, user)
        } catch (error) {
            console.error("Error deserializando el usuario: " + error)
        }
    })
}

export default initializePassport