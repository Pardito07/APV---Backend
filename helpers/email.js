import nodemailer from 'nodemailer';
import Sib from 'sib-api-v3-sdk'

const emailRegistro = async datos => {
    const { nombre, email, token } = datos;

    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY

    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
        email: 'diegopar03@gmail.com',
        name: 'Diego Pardo',
    }
    const receivers = [
        {
            email,
        },
    ]

    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'APV - Confirma tu cuenta',
        htmlContent: `
            <p style="display:block; color:#374151; font-weight:bold; text-transform:uppercase;">Hola: ${nombre}, confirma tu cuenta en APV</p>
            <p style="display:block; color:#374151; font-weight:bold; text-transform:uppercase;">Tu cuenta esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
            <a style="background-color:#4f46e5; font-weight:bold; color:white; padding:10px; border-radius:5px; text-decoration:none; text-transform:uppercase; margin-top:20px; margin-bottom:20px;" href="http://${process.env.FRONTEND_URL}/${token}">Confirmar Cuenta</a>
            <p style="display:block; color:#374151; font-weight:bold; text-transform:uppercase;">Si tu no creaste esta cuenta, puedes ignorar este mensaje<p>
        `
    })
    .then(console.log)
    .catch(console.log)
}

const emailRecuperarPassword = async datos => {

    const { nombre, email, token } = datos;

    const client = Sib.ApiClient.instance
    const apiKey = client.authentications['api-key']
    apiKey.apiKey = process.env.API_KEY

    const tranEmailApi = new Sib.TransactionalEmailsApi()
    const sender = {
        email: 'diegopar03@gmail.com',
        name: 'Diego Pardo',
    }
    const receivers = [
        {
            email,
        },
    ]

    tranEmailApi
    .sendTransacEmail({
        sender,
        to: receivers,
        subject: 'APV - Reestablece tu contraseña',
        htmlContent: `
            <p style="display:block; color:#374151; font-weight:bold; text-transform:uppercase;">Hola: ${nombre}, has solicitado reestablecer tu contraseña</p>
            <p style="display:block; color:#374151; font-weight:bold; text-transform:uppercase;">sigue el siguiente enlace para generar una nueva:</p>
            <a style="background-color:#4f46e5; font-weight:bold; color:white; padding:10px; border-radius:5px; text-decoration:none; text-transform:uppercase; margin-top:20px; margin-bottom:20px;" href="http://${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a>
            <p style="display:block; color:#374151; font-weight:bold; text-transform:uppercase;">Si tu no solicitaste este email, puedes ignorar este mensaje<p>
        `
    })
    .then(console.log)
    .catch(console.log)
}

export {
    emailRegistro,
    emailRecuperarPassword
}