const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  comentarios: [
    {
      usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios'
      },
      comentario: String,
      data: {
        type: Date,
        default: Date.now
      }
    }
  ],
  dataPublicacao: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
