import mongoose from "mongoose"
import config from "./config.js"

export default class MongoSingleton {
    static #instance
    constructor() {
        this.#connectMongoDB()
    }
    static getInstance() {
        if (this.#instance) {
            console.log("Ya hay una conexión abierta a MongoDB")
        } else {
            this.#instance = new MongoSingleton()
        }
        return this.#instance
    }
    #connectMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl)
        } catch (error) {
            process.exit()
        }
    }
}