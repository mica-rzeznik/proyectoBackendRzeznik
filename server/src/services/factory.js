import config from '../config/config.js'
import MongoSingleton from '../config/mongodb-singleton.js'

let userService

switch (config.persistence) {
    case 'mongodb':
        const mongoInstance = async () => {
            console.log("Entrando a iniciar Service para MongoDb")
            try {
                await MongoSingleton.getInstance()
            } catch (error) {
                console.error(error)
                process.exit(0)
            }
        }
        mongoInstance()
        const { default: userService } = await import('./db/users.services.js')
        userService = new userService()
        console.log("User service loaded:")
        console.log(userService)
        break
    case 'files':
        const { default: userManager } = await import('./filesystem/UserManager.js')
        userService = new userManager()
        console.log("User service loaded:")
        console.log(userService)
        break

    default:
        break
}

export { userService }