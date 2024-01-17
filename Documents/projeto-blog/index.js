const express = require('express');
const bodyparser = require('body-parser');
const { default: mongoose } = require('mongoose');

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}));

//routers
const usersRouter = require("./routes/user")
const PostRouter = require('./routes/post')
const ComentarioRouter = require('./routes/comentarios')

app.use("/user", usersRouter)
app.use('/post', PostRouter)
app.use('/comentario', ComentarioRouter)

mongoose.connect("mongodb://localhost:27017/", {
    dbName: 'blog'
})
.then(() =>{
    console.log("Conexao ON");
})
.catch((err) => {
    console.error.bind(console, 'Erro de conexao mongoDB /n' + err)
})

app.get("/home", (req, res) => {
    res.sendStatus(200).send("OK")
});



module.exports = app