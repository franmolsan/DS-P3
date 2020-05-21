const mongoose = require('mongoose')

// librería para el hashing de las contraseñas
const bcrypt = require('bcrypt'); 

const Schema = mongoose.Schema;


// para cada usuario guardaremos:
// email: String con la que identificaremos a usuario - "clave primaria"
// password
// nombre de usuario (name)
// puntuacion Maxima del usuario (highScore) - empieza en 0
// utilizamos un "Schema" -> validación y casting automáticos.
const UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  name : {
    type: String,
    required: true
  },
  highScore : {
    type: Number,
    default: 0
  },

  // para restablecer la contraseña
  resetToken: {
    type: String
  },
  resetTokenExp: {
    type: Date
  }
});

// pre-save hook (se llama antes de guardar en la bd)
UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// para validar la pass del usuario
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

// crear modelo y exportarlo
const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
