const mongoose = require('mongoose');
const validate = require('mongoose-validator');
// валидатор
const urlValidator = [
  validate({
    validator: 'isURL',
    message: 'Неверный формат URL',
  }),
];
const article = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: urlValidator,
  },
  image: {
    type: String,
    required: true,
    validate: urlValidator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});
module.exports = mongoose.model('article', article);
