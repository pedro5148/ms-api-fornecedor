import email from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const enviaEmail = async options => {
    const provedor = email.createTransport({
        host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
        port: process.env.EMAIL_PORTA,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_SENHA
        }
    });

    const mailOptions = {
        from: 'Suporte API <noreply@api-fornecedor.com>',
        to: options.email,
        subject: options.subject,
        text: options.mensagem
    };

    await provedor.sendMail(mailOptions); //retorna uma promisse
    console.log(`📧 Email enviado com sucesso para ${options.email}`);
}

export default { enviaEmail };