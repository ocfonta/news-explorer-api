require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routers = require('./routes');

const { login, createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
// const { urlValidator } = require('./middlewares/urlValidate');
const { errorHandle } = require('./middlewares/errorHandle');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/yapidb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
/* app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); */
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(new Error('Некорректная почта')),
    password: Joi.string().required().min(6),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().error(new Error('Некорректная почта')),
    password: Joi.string().required().min(6).error(new Error('Пароль должен содержать не менее 6 символов')),
    name: Joi.string().required().min(2).max(30),

  }),
}), createUser);

app.use('/', auth, routers);

app.use(errorLogger);
app.use(errors());
app.use(errorHandle);

app.listen(PORT, () => {

// console.log(`App listening on port ${PORT}`);
});
