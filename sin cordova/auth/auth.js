const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;

const UserModel = require('../models/userModel');

// para el registro (signup) del usuario
passport.use('signup', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const { name } = req.body;
    const user = await UserModel.create({ email, password, name});
    return done(null, user);
  } catch (error) {
    done(error);
  }
}));


// para el inicio de sesión (login) del usuario
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      return done(null, false, { message: 'Wrong Password' });
    }
    return done(null, user, { message: 'Logged in Successfully' });
  } catch (error) {
    return done(error);
  }
}));


// verificar que el token es válido
// el jwt (json web token) estará en una cookie
passport.use('jwt', new JWTstrategy({
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


// verificar que el token es válido
// el jwt (json web token) se le pasará como datos en la petición
passport.use('jwt_no_cookie', new JWTstrategy({
  secretOrKey: 'top_secret',
  jwtFromRequest: function (req) {
    let token = null;
    if (req){
      token = req.url.substr(12);
      console.log(req.url)
    } 
    return token;
  }
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));