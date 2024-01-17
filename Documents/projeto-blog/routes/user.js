//express
const express = require('express')
const app = express.Router();
//model
const UsuarioModel = require('../models/usuarios')
//recurosos
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const JWTSecret = "ndajsnd778bcxi*&*s*&";
const crypto = require('crypto');
//imports
const Authorization = require("./auth")
const EnviarEmail = require('../public/email')


app.post("/cadastro", async (req, res) => {
    const {nome, email, senha} = req.body;

    for (const key in req.body) {
        if (req.body[key] == "" || req.body[key] == undefined) {
            res.send("Falta de dados: " + key)
        }
    }

    const hash = await bcrypt.hash(senha, await bcrypt.genSalt(10))

    if(await UsuarioModel.findOne({email: email}) == null){
       try {
            var novoCadastro = new UsuarioModel({nome, email, senha: hash});
            await novoCadastro.save();
            res.send("OK").sendStatus(200)
       } catch (error) {
            console.log(error)
            res.send("Erro no cadastro").sendStatus(500)
       }
    }else{
        res.send("Email ja em uso").sendStatus(200)
    }
})

app.post('/login', async(req, res) =>{
    const {email, senha} = req.body;
    const usuario = await UsuarioModel.findOne({"email": email})
    if(usuario == undefined){
        res.json({errors:{email: "E-mail não cadastrado"}}).sendStatus(403)
    }else{
        if(await bcrypt.compare(senha, usuario.senha)){
            jwt.sign({email: email, id: usuario._id}, JWTSecret, {expiresIn: "1h"}, (err, token) => {
                if(err){
                    res.sendStatus(500);
                    console.log(err)
                }
                res.json({token})
            })
        }else{
            res.json({errors: {senha: "Senha incorreta"}}).statusCode = 403;
        }
    }
})

app.get("/home", Authorization, (req, res) => {
    res.sendStatus(200).send("OK")
});

app.post("/login/esqueciSenha", async (req, res) => {

    const buffer = crypto.randomBytes(16);
    const codigo = buffer.toString("hex")
    const email = req.body.email
    var user = await UsuarioModel.findOne({email: email}) 
    console.log(user)
    if (user != null) {
        try {
            var emailRecuperacao = new EnviarEmail(email, "recuperacao de email", `Seu codigo de recuperacao: ${codigo} | 
            http://localhost:8080/user/login/redefinirSenha/${email}` )
            emailRecuperacao.Enviar()
            await UsuarioModel.updateOne({email: email}, {codigoRecuperacao: codigo})
            res.send('Um email foi enviado para atualizar a sua senha')
        } catch (error) {
            console.log(error);
            res.send("Erro de envio de email")
        }
    } else {
        res.send("Esse email náo esta cadastrado")
    }

    
})

app.post("/login/redefinirSenha/:email", async (req, res) =>{
    var {codigo, senha, confirmaSenha} = req.body
    var email = req.params.email
    if (senha === confirmaSenha || senha == "" || confirmaSenha == "") {
        try {
            var user = await UsuarioModel.findOne({email: email})
            if (user.codigoRecuperacao === codigo ) {
                const hash = await bcrypt.hash(senha, await bcrypt.genSalt(10))
                await UsuarioModel.updateOne({email: email}, {senha: hash})
            }else{
                res.send("Codigo de verificacao invalido").end
            }
            res.send("OK")
            await UsuarioModel.updateOne({email: email}, {codigoRecuperacao: ""})
        } catch (error) {
            console.log(error)
            res.send("Algo de errado")
        }
    } else {
        res.send("As senhas nao sao iguais")
    }

})


module.exports = app
