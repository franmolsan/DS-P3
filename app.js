// leer fichero .env para tener disponibles las variables de entorno
require('dotenv').config();
 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rutas = require('./routes/main');
const rutasSeguras = require('./routes/secure');
const cookieParser = require('cookie-parser');
const passport = require('passport');
 
// conectar con mongo
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('Conexión a mongo establecida');
});

// instancia de express
const app = express();
 
// configuración de express
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(cookieParser());
 
// autenticación passport
require('./auth/auth');
 
// rutas estándar
app.use('/', rutas);

// rutas seguras
app.use('/', passport.authenticate('jwt', { session : false }), rutasSeguras);

// resto de rutas (404 - not found)
app.use((req, res, next) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});
 
// ruta para errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error : err });
});
 
// iniciar el servidor (escucha en el puerto 3000)
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT || 3000}`);
});