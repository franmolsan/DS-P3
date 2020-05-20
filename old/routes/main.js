const passport = require('passport');
const express = require('express');
const jwt = require('jsonwebtoken');
 
const tokenList = {};
const router = express.Router();
 
router.get('/status', (req, res, next) => {
  res.status(200).json({ status: 'ok' });
});
 
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.status(200).json({ message: 'Registro correcto' });
});
 
router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, usuario, info) => {
    try {
      if (err || !usuario) {
        const error = new Error('Ha ocurrido un error');
        return next(error);
      }
      req.login(usuario, { session: false }, async (error) => {
        if (error) return next(error);
        const body = {
          _id: usuario._id,
          email: usuario.email
        };
 
        const token = jwt.sign({ usuario: body }, 'top_secret', { expiresIn: 300 }); // 5 mins
        const refreshToken = jwt.sign({ usuario: body }, 'top_secret_refresh', { expiresIn: 86400 }); // 1 dia
 
        // guardar tokens en la cookie
        res.cookie('jwt', token);
        res.cookie('refreshJwt', refreshToken);
 
        // guardar tokens en memoria
        tokenList[refreshToken] = {
          token,
          refreshToken,
          email: usuario.email,
          _id: usuario._id
        };
 
        // Devolver tokens al usuario
        return res.status(200).json({ token, refreshToken });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});
 
router.post('/token', (req, res) => {
  const { email, refreshToken } = req.body;
 
  if ((refreshToken in tokenList) && (tokenList[refreshToken].email === email)) {
    const body = { email, _id: tokenList[refreshToken]._id };
    const token = jwt.sign({ usuario: body }, 'top_secret', { expiresIn: 300 });
 
    // actualiza jwt
    res.cookie('jwt', token);
    tokenList[refreshToken].token = token;
 
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'No autorizado' });
  }
});
 
router.post('/logout', (req, res) => {

  // si la petición tenía cookie, es porque el usuario estaba logeado
  if (req.cookies) {
    const refreshToken = req.cookies['refreshJwt'];
    if (refreshToken in tokenList) delete tokenList[refreshToken]
    res.clearCookie('refreshJwt');
    res.clearCookie('jwt');
  }
 
  res.status(200).json({ message: 'Logout correcto' });
});
 
module.exports = router;