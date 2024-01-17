const express = require('express')
const app = express.Router();
const Authorization = require("./auth");
const PostModel = require('../models/post');
const ComentarioModel = require('../models/comentarios')
const mongoose = require('mongoose');

app.post("/publicar/:post", Authorization, async(req, res) => {
    const postId = req.params.post;
    const usuario = req.usuario.id
    const textoComentario = req.body.comentario

    try {
        if (mongoose.isValidObjectId(postId)) {
            const post = await PostModel.findById({_id: postId})
            if (!post) {
                res.send("Post nao encontrado").sendStatus()
            }
            const newComentario = new ComentarioModel({usuario: usuario, comentario: textoComentario})
            await newComentario.save();

            post.comentarios.push({usuario: usuario, comentario: textoComentario});
            await post.save()
            res.send("OKS")
        } else {
            res.send("post náo encontrado")
        }
    } catch (error) {
        console.log(error)
        res.send("Algo de erro ocorreu").status(500)
    }

})

module.exports = app