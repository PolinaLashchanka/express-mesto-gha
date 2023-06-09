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
    .catch((err) => res.status(500).send({
      message: 'Internal server error',
      err: err.massage,
      stack: err.stack,
    }));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({
          message: 'Card not found',
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

module.exports = {
  getCards,
  createCard,
  deleteCard,
};
