import nodemailer from 'nodemailer'
import config from '../config/config.js'
import __dirname from '../utils.js'
import logger from '../config/logger.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
})

transporter.verify(function (error, success) {
    if (error) {
        logger.error(error)
    } else {
        logger.debug('Server is ready to take our messages')
    }
})

export const sendEmail = (req, res, ticket) => {
    try {
        let productsHtml = ticket.products.map((item) => {
            return `<li>
                        <p><strong>Título:</strong> ${item.product.title}</p>
                        <p><strong>ID:</strong> ${item.product._id}</p>
                        <p><strong>Precio:</strong> ${item.product.price}</p>
                        <p><strong>Cantidad:</strong> ${item.quantity}</p>
                        <p><strong>Total parcial:</strong> ${item.partialAmount}</p>
                    </li>`
        }).join("")
        let mailOptions = {
            from: "Honeydukes" + config.gmailAccount,
            to: ticket.purchaser_email,
            subject: "Ticket de su compra en honeydukes",
            html: `<div>
                        <h1>Gracias por su compra</h1>
                        <p>Código de su compra: ${ticket.code}</p>
                        <p>Fecha de su compra: ${ticket.purchase_datetime}</p>
                        <p>Su nombre: ${ticket.purchaser_name}</p>
                        <p>Id de su carrito: ${ticket.cart}</p>
                        <ul>
                            ${productsHtml}
                        </ul>
                        <p>Valor total: ${ticket.amount}</p>
                    </div>`,
            attachments: []
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(400).send({ message: "Error", payload: error })
            }
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount })
    }
}

export const passwordEmail = (req, res, email, resetPasswordLink) => {
    try {
        let mailOptions = {
            from: "Honeydukes" + config.gmailAccount,
            to: email,
            subject: "Link para restablecer contraseña - Honeydukes",
            html: `<div>
                        <h1>Para restablecer su contraseña</h1>
                        <a href='${resetPasswordLink}' >Haga click aquí</a>
                    </div>`,
            attachments: []
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(400).send({ message: "Error", payload: error.message })
            } else {
                res.status(200).send({ message: "Success", payload: info })
            }
        })
    } catch (error) {
        res.status(500).send({ error: error.message, message: "No se pudo enviar el email desde:" + config.gmailAccount })
    }
}