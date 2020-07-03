const usersRoute = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { userMe } = require('../controllers/users');

// GET
usersRoute.get('/me', userMe);
module.exports = usersRoute;
