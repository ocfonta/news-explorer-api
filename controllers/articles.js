const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');

const ForbidErr = require('../errors/forbidden-err');

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.status(200).send({ data: article });
    })
    .catch(next);
};

const allArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
};
const delArticle = (req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Статья не найдена');
      }
      if (article.owner.toString() === req.user._id) {
        return article.remove(req.params.articleId)
          .then(() => res.status(200).send(article));
      }
      throw new ForbidErr('Нет прав на удаление');
    })
    .catch(next);
};

module.exports = { createArticle, allArticles, delArticle };
