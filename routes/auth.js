const signIn = require('express').Router();
const signUp = require('express').Router();
const logOut = require('express').Router();

const { Joi, celebrate } = require('celebrate');
const { login, createUser } = require('../controllers/users');

signIn.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(new Error('Некорректная почта')),
    password: Joi.string().required().min(6),
  }),
}), login);
signUp.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(new Error('Некорректная почта')),
    password: Joi.string().required().min(6).error(new Error('Пароль должен содержать не менее 6 символов')),
    name: Joi.string().required().min(2).max(30),

  }),
}), createUser);
logOut.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    path: '/',
    signed: false,
    maxAge: -1,
    expires: new Date(0),
  });
  res.json({
    message: 'cookies clear',
  });
});

module.exports = { signIn, signUp };
