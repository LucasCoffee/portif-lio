const mongoose = require('mongoose');

const UsuariosShema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    senha:{
        type: String,
        required: true,
    },
    post:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    dataRegistro: {
        type: Date,
        default: Date.now
    },
    codigoRecuperacao:{
        type: String,
        required: false
    }
})

module.exports = mongoose.model("Usuarios", UsuariosShema);