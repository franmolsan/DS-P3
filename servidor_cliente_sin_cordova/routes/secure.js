/* fichero para las rutas seguras */

const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

router.post('/submit-score', asyncMiddleware(async (req, res, next) => {
  const { email, score } = req.body;

  // obtener highscore actual almacenado en la bd
  var playerHighScore =  (await UserModel.findOne({email: email}, 'highScore -_id')).toJSON();

  console.log (playerHighScore.highScore);
  // solo se actualiza si el score conseguido en la partida es mayor.
  if (score > playerHighScore.highScore){
    await UserModel.updateOne({ email }, { highScore: score });
  }
  
  res.status(200).json({ status: 'ok' });
}));

router.get('/scores', asyncMiddleware(async (req, res, next) => {

  // obtener todos los highScores (puntuaciones máximas)
  // ordenarlos descendentemente
  // devoler los 10 primeros
  const users = await UserModel.find({}, 'name highScore -_id').sort({ highScore: -1}).limit(10);
  res.status(200).json(users);
}));

module.exports = router;
