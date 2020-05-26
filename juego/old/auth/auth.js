const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
 
const ModeloUsuario = require('../modelos/modeloUsuario');
 
// para el registro (signup) del usuario
passport.use('signup', new localStrategy({
  usuarionombreField: 'email',
  passField: 'pass',
  passReqToCallback: true
}, async (req, email, pass, done) => {
  try {
    const { nombre } = req.body;
    const usuario = await ModeloUsuario.create({ email, pass, nombre });
    return done(null, usuario);
  } catch (error) {
    done(error);
  }
}));


// para el inicio de sesión (login) del usuario
passport.use('login', new localStrategy({
    usuarionameField: 'email',
    passwordField: 'pass'
  }, async (email, pass, done) => {
    try {
      const usuario = await ModeloUsuario.findOne({ email });
      if (!usuario) {
        return done(null, false, { message: 'Usuario no encontrado' });
      }
      const validate = await usuario.passValida(pass);
      if (!validate) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, usuario, { message: 'Login correcto' });
    } catch (error) {
      return done(error);
    }
  }));
   
  // verificar que el token es válido
  // el jwt (json web token) estará en una cookie
  passport.use(new JWTstrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: function (req) {
      let token = null;
      if (req && req.cookies) token = req.cookies['jwt'];
      return token;
    }
  }, async (token, done) => {
    try {
      return done(null, token.usuario);
    } catch (error) {
      done(error);
    }
  }));