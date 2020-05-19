const express = require('express');
const router = express.Router();
 
const asyncMiddleware = require('../middleware/asyncMiddleware');
const ModeloUsuario = require('../modelos/modeloUsuario');

// "endpoints" (rutas) para las funciones del servidor
router.get('/status', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
  console.log('acceso a status');
});

// ruta para el signup
router.post('/signup', asyncMiddleware( async (req, res, next) => {
  // utilizamos el middleware para que este gestione los errores
  const { nombre, email, pass } = req.body;
  await ModeloUsuario.create({ email, pass, nombre });
  res.status(200).json({ 'status': 'ok' });
}));
 

router.post('/login', asyncMiddleware(async (req, res, next) => {
  // utilizamos el middleware para que este gestione los errores
  const { email, pass } = req.body;
  const usuario = await ModeloUsuario.findOne({ email }); // buscar usuario con el email introducido
  if (!usuario) { // no encontramos usuario con ese email 
    res.status(401).json({ 'mensaje': 'no autenticado' });
    return;
  }
  const validacion = await usuario.passValida(pass); // validar contraseña
  if (!validacion) { // contraseña incorrecta
    res.status(401).json({ 'mensaje': 'no autenticado' });
    return;
  }

  // email y contraseña correctos
  res.status(200).json({ 'status': 'ok' });
}));
 
router.post('/logout', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
  console.log('acceso a logout');
});
 
router.post('/token', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
  console.log('acceso a token');
});
 
module.exports = router;