const articlesRoute = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('../middlewares/urlValidate');
const { createArticle, allArticles, delArticle } = require('../controllers/articles');

articlesRoute.get('/', allArticles);

articlesRoute.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().error(new Error('Ключевое слово не передано')),
    title: Joi.string().required().error(new Error('Заголовок не передан')),
    text: Joi.string().required().error(new Error('Пустая статья')),
    date: Joi.string().required(),
    source: Joi.string().required().error(new Error('Обязательное поле: source')),
    link: Joi.string().custom(urlValidator, 'urlValidator').required(),
    image: Joi.string().custom(urlValidator, 'urlValidator').required(),
  }),
}), createArticle);

articlesRoute.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
}), delArticle);

module.exports = articlesRoute;
