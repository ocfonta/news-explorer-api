const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
// const NotFoundError = require('../errors/not-found-err');

const BadRequestError = require('../errors/bad-request'); // 400
const ConfErr = require('../errors/conflict-err'); // 409
const AuthErr = require('../errors/unauthorized-err');

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashPassword) => User.create({
      email,
      password: hashPassword,
      name,
    }))
    .then(() => res.status(201).send({
      message: 'Done!',
    }))
    .catch((err) => {
      if (err.errors.email.name === 'ValidatorError') {
        throw new ConfErr('Пользователь с таким email уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError(err.message);
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Неверный запрос');
      }
    })
    .catch((err) => next(err));
};
const userMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findByEmail(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: false,
        sameSite: true,
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      throw new AuthErr(err.message);
    })
    .catch(next);
};

module.exports = {
  userMe, createUser, login,
};
