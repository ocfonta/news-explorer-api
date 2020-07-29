require('dotenv').config();
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routers = require('./routes');

const auth = require('./middlewares/auth');
const { signIn, signUp, logOut } = require('./routes/auth');
const { errorHandle } = require('./middlewares/errorHandle');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const corsOptions = {
  origin: ['https://mestopraktikum.xyz', 'http://localhost:8080', 'https://ocfonta.github.io/news-explorer-frontend'],
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
const { PORT = 3001 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.use('/', signUp);
app.use('/', signIn);
app.use('/', logOut);
app.use('/', auth, routers);

app.use(errorLogger);
app.use(errors());
app.use(errorHandle);

app.listen(PORT, () => {

// console.log(`App listening on port ${PORT}`);
});
