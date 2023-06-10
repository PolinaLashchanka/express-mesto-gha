const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({
      message: 'Internal server error',
      err: err.massage,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(400).send({ message: 'Вы ввели некорректные данные' });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.send({ data: card}))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Запрашиваеая карточка не найдена',
        });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card.likes))
    .catch((err) => {
      if (err.message.includes('Cannot read properties of nul')) {
        res.status(404).send({
          message: 'Запрашиваеая карточка не найдена',
        });
      } else if (err.message.includes('Cast to ObjectId failed for value')) {
        res.status(400).send({ message: 'Введен некорректный id карточки' });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card.likes))
    .catch((err) => {
      if (err.message.includes('Cannot read properties of nul')) {
        res.status(404).send({
          message: 'Запрашиваеая карточка не найдена',
        });
      } else if (err.message.includes('Cast to ObjectId failed for value')) {
        res.status(400).send({ message: 'Введен некорректный id карточки' });
      } else {
        res.status(500).send({
          message: 'Internal server error',
          err: err.massage,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
