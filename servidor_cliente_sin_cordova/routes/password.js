const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto'); // para crear el token aleatorio que se usará cuando el usuario
                                  // resetee la contraseña

const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const email = process.env.EMAIL;
const pass = process.env.PASSWORD;

let testAccount = nodemailer.createTestAccount();

// crear transporte con el servicio, el usuario y la contraseña 
const smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: email,
    pass: pass
  }
});

// para usar "handlebar templates"
/*
const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./templates/'),
  extName: '.html'
};
*/

const handlebarsOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: './templates/',
    layoutsDir: './templates/'
  },
  viewPath: path.resolve('./templates/'),
  extName: '.html'
};

// usar handlebars
// smtpTransport.use('compile', hbs(handlebarsOptions));

const router = express.Router();

// ruta para contraseña olvidada
router.post('/forgot-password', asyncMiddleware(async (req, res, next) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({ 'message': 'invalid email' });
      return;
    }
  
    // crear token usuario
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString('hex');
  
    // actualizar token de restablecer contraseña      
    await UserModel.findByIdAndUpdate({ _id: user._id }, { resetToken: token, resetTokenExp: Date.now() + 600000 });
  
    
    var url = `http://localhost:${process.env.PORT || 3000}/reset-password.html?token=${token}`;
    // enviar email para restablecer contraseña
    const data = {
      to: user.email,
      from: email,
      template: 'forgot-password',
      subject: 'Juego DS-P3 Restablecer contraseña',
      context: {
        url: `http://localhost:${process.env.PORT || 3000}/reset-password.html?token=${token}`,
        name: user.name
      },
      html: `<h3>Hola ${user.name},</h3> <p>Has solicitado un cambio de contraseña. Utiliza este <a href=${url}>enlace</a> para cambiarla.</p>`
    };
    await smtpTransport.sendMail(data);
    res.status(200).json({ message: 'Se ha enviado un email para restablecer la contraseña. El enlace solo es válido durante 10 minutos.' });
  }));


  // ruta para restablecer contraseña
  router.post('/reset-password', asyncMiddleware(async (req, res, next) => {
    const user = await UserModel.findOne({ resetToken: req.body.token, resetTokenExp: { $gt: Date.now() } });
    if (!user) {
      res.status(400).json({ 'message': 'token no válido' });
      return;
    }
   
    // comprobar que la contraseñas coinciden
    if (req.body.password !== req.body.verifiedPassword) {
      res.status(400).json({ 'message': 'las contraseñas no coinciden' });
      return;
    }
   
    // actualizar modelo de usuario (BD)
    user.password = req.body.password;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();
   
    // enviar email de cambio de contraseña
    const data = {
      to: user.email,
      from: email,
      subject: 'Juego DS-P3 Confirmación de cambio de contraseña',
      /*
      context: {
        name: user.name
      },*/
      html: `<h3>Hola ${user.name},</h3><p>Tu contraseña ha sido cambiada con éxito. Ya puedes inciar sesión con ella.</p>`
    };
    await smtpTransport.sendMail(data);
   
    res.status(200).json({ message: 'Contraseña cambiada' });
  }));
   
  module.exports = router;