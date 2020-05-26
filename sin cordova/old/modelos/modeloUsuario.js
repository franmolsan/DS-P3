const mongoose = require('mongoose')
const bcrypt = require('bcrypt'); // librería para el hashing de las passs
 
const Esquema = mongoose.Schema;

// para cada usuario guardaremos:
// email: String con la que identificaremos a usuario - "clave primaria"
// pass 
// nombre de usuario (nick)
// puntuacion Maxima del usuario (highScore) - empieza en 0
// utilizamos un "Schema" -> validación y casting automáticos.
const EsquemaUsuario = new Esquema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  pass : {
    type : String,
    required : true
  },
  nombre : {
    type: String,
    required: true
  },
  puntuacionMaxima : {
    type: Number,
    default: 0
  }
});

// pre-save hook (se llama antes de guardar en la bd)
EsquemaUsuario.pre('save', async function (next) {
  const usuario = this;
  const hash = await bcrypt.hash(this.pass, 10);
  this.pass = hash;
  next();
});

// para validar la pass del usuario
EsquemaUsuario.methods.passValida = async function (password) {
  const usuario = this;
  const comparacion = await bcrypt.compare(password, usuario.pass);
  return comparacion;
}
 
// crear modelo y exportarlo
const ModeloUsuario = mongoose.model('usuario', EsquemaUsuario);
module.exports = ModeloUsuario;