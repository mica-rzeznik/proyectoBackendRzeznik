import nodemailer from 'nodemailer'
import config from '../config/config.js'
import __dirname from '../utils.js'

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
        console.log(error)
    } else {
        console.log('Server is ready to take our messages')
    }
})

export const sendEmail = (req, res, ticket) => {
    try {
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
                        <p>Valor total: ${ticket.amount}</p>
                    </div>`,
            attachments: []
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                res.status(400).send({ message: "Error", payload: error })
            }
            console.log('Message sent: ', info.messageId)
            res.send({ message: "Success", payload: info })
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount })
    }
}