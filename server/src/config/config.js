import dotenv from 'dotenv'
import { Command } from 'commander'
// import logger from './logger.js'

const program = new Command()

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop')
program.parse()

console.log("Mode Option: ", program.opts().mode)

const environment = program.opts().mode

dotenv.config({
    path: `./server/src/config/.env.${environment}`
})

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD
}
// import logger from './logger.js'
// logger.info("Mode Option: ", program.opts().mode)