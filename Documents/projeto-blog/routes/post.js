const express = require('express')
const app = express.Router();
const Authorization = require("./auth");
const PostModel = require('../models/post')
const jwt = require("jsonwebtoken");
const Mongoose = require('mongoose');
const JWTSecret = "ndajsnd778bcxi*&*s*&";

app.get("/home", async (req, res) => {

    try {
        var post = await PostModel.find()
        res.json(post)
    } catch (error) {
        res.send("erro para ver posts")
    }

});

app.get("/meuspost", Authorization, async (req, res) => {
   var post = await PostModel.find({"autor": req.usuario.id})
    res.json(post)

})

app.post("/publicar", Authorization, async (req, res) => {

    const {titulo, conteudo} = req.body

    for (const key in req.body) {
        if (req.body[key] == "" || req.body[key] == undefined || req.body == {}) {
            res.send("Falta de dados: " + key)
        }
    }

    try {
        const novoPost = new PostModel({titulo, conteudo, autor: req.usuario.id})
        await novoPost.save()
        res.send("OK").sendStatus(200)
    } catch (error) {
        console.log(error)
        res.send("Erro no cadastro do post").sendStatus(404)
    }
})

module.exports = app