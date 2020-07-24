require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routers = require('./routes');

const auth = require('./middlewares/auth');
const { signIn, signUp } = require('./routes/auth');
const { errorHandle } = require('./middlewares/errorHandle');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: ['http://mestopraktikum.xyz/', 'https://mestopraktikum.xyz/', 'http://localhost:8080'],
  methods: 'GET, POST, PUT, DELETE, PATCH, HEAD',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

const app = express();
app.use('*', cors(corsOptions));
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

app.use('/', signUp);
app.use('/', signIn);
app.use('/', auth, routers);

app.use(errorLogger);
app.use(errors());
app.use(errorHandle);

app.listen(PORT, () => {

// console.log(`App listening on port ${PORT}`);
});
