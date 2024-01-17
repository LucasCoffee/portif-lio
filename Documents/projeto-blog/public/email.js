const Nodemailer = require('nodemailer');

const transporter = Nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587 ,
    auth: {
      user: "9666889bef05a1",
      pass: "ced46ea802fe54"
    }
})

class EnviarEmail{
    constructor(email, titulo, conteudo){
        this.email = email;
        this.titulo = titulo;
        this.conteudo = conteudo
    }

    async Enviar(){

        const mailOptions = {
            from: "Lucas <0796c183738ead>",
            to: this.email,
            subject: this.titulo,
            text: this.conteudo
        }

        try {
            var infEmail = await transporter.sendMail(mailOptions)
            console.log("Email enviado", infEmail)
        } catch (error) {
            console.error("Erro no envio do email", error)
        }

    }
}

module.exports = EnviarEmail