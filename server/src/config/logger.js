import winston from "winston"
import config from "./config.js"

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'green',
        info: 'blue',
        http: 'magenta',
        debug: 'white'
    }
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        )
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({colors: customLevelsOptions.colors}),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File(
            {
                filename: './errors.log', 
                level: 'error',
                format: winston.format.json()
            }
        )
    ]
})

export const addLogger = (req, res, next) => {
    if (config.environment === 'production'){
        req.logger = prodLogger
    } else {
        req.logger = devLogger
    }
    req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    next()
}

let logger

if (config.environment === 'production') {
    logger = prodLogger
} else {
    logger = devLogger
}

logger.info(`Logger inicializado - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

export default logger