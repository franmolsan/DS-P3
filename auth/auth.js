const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
 
const ModeloUsuario = require('../modelos/modeloUsuario');
 
// para el registro (signup) del usuario
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'pass',
  passReqToCallback: true
}, async (req, email, pass, done) => {
  try {
    const { name } = req.body;
    const user = await ModeloUsuario.create({ email, pass, name });
    return done(null, user);
  } catch (error) {
    done(error);
  }
}));


// para el inicio de sesión (login) del usuario
passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'pass'
  }, async (email, pass, done) => {
    try {
      const user = await ModeloUsuario.findOne({ email });
      if (!user) {
        return done(null, false, { mensaje: 'Usuario no encontrado' });
      }
      const validate = await user.passValida(pass);
      if (!validate) {
        return done(null, false, { mensaje: 'Contraseña incorrecta' });
      }
      return done(null, user, { mensaje: 'Login correcto' });
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
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));