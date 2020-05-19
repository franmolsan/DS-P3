/* fichero para las rutas seguras */

const express = require('express');

const asyncMiddleware = require('../middleware/asyncMiddleware');
const ModeloUsuario = require('../modelos/modeloUsuario');

const router = express.Router();

router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
  const { email, score } = req.body;
  await ModeloUsuario.updateOne({ email }, { puntuacionMaxima: score });
  res.status(200).json({ status: 'ok' });
}));

router.get('/scores', asyncMiddleware(async (req, res, next) => {

  // obtener todos los highScores (puntuaciones máximas)
  // ordenarlos descendentemente
  // devoler los 10 primeros
  const users = await ModeloUsuario.find({}, 'name puntuacionMaxima -_id').sort({ puntuacionMaxima: -1}).limit(10);
  res.status(200).json(users);
}));

module.exports = router;