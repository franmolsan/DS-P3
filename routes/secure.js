// fichero para las rutas seguras
const express = require('express');
 
const router = express.Router();
 
router.post('/submit-score', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
  console.log('acceso a submit-score');
});
 
router.get('/scores', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
  console.log('acceso a scores');
});
 
module.exports = router;