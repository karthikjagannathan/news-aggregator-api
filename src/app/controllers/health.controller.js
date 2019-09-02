const healthCtrl = {};

const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

healthCtrl.getHealth = (req, res) => {
  res.status(200).send('Server is up!');
};

module.exports = healthCtrl;
