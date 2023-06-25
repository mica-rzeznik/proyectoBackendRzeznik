import {Router} from 'express'

const router = Router()

router.get('/', (req, res)=>{
    req.logger.debug('Mensaje de debug')
    req.logger.http('Mensaje de http')
    req.logger.info('Mensaje de info')
    req.logger.warning('Mensaje de warning')
    req.logger.error('Mensaje de error')
    req.logger.fatal('Mensaje de fatal')
    res.send('Prueba de loggers')
})

export default router