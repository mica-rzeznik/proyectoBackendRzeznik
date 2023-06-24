import config from '../config/config.js'
import MongoSingleton from '../config/mongodb-singleton.js'

let userService

switch (config.persistence) {
    case 'mongodb':
        const mongoInstance = async () => {
            try {
                await MongoSingleton.getInstance()
            } catch (error) {
                process.exit(0)
            }
        }
        mongoInstance()
        const { default: userService } = await import('./db/users.services.js')
        userService = new userService()
        break
    case 'files':
        const { default: userManager } = await import('./filesystem/UserManager.js')
        userService = new userManager()
        break

    default:
        break
}

export { userService }