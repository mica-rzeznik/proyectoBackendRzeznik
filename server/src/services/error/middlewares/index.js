import EErrors from '../errors-enum.js'

export default (error, req, res, next) => {
    console.error("Error detectado entrando al Error Handler")
    console.error(error.cause)
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "Error", error: error.message })
            break
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "Error", error: error.message })
            break
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "Error", error: error.message })
            break
        default:
            res.status(500).send({ status: "Error", error: "Unhandled error!" })
            break
    }
}