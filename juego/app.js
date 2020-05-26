// leer fichero .env para tener disponibles las variables de entorno
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');
const passwordRoutes = require('./routes/password');

// conectar con mongo
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});
mongoose.set('useFindAndModify', false);

// instancia de express
const app = express();

// configuración de express
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());

// autenticación passport 
require('./auth/auth');

app.get('/game.html', passport.authenticate('jwt', { session : false }), function (req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

// para servir ficheros estáticos
app.use(express.static(__dirname + '/public'));

// root -> index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// rutas estándar
app.use('/', routes);
// rutas para cambio de contraseña
app.use('/', passwordRoutes);
// rutas seguras
app.use('/', passport.authenticate('jwt', { session : false }), secureRoutes);

// resto de rutas (404 - not found)
app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});

// ruta para errores
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

// iniciar el servidor (escucha en el puerto 3000)
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
