const express = require('express');
const httpContext = require('express-http-context');

const health = require('./health.routes');
const login = require('./login.routes');
const scrapper = require('./scrapper.routes');
const news = require('./news.routes');

const router = express.Router();

// index routes
router.get('/', (req, res) => {
  res.set({
    'x-correlation-id': httpContext.get('requestId'),
  });
  res.send(`Welcome to scrapper: ${req.hostname} REST-API`);
});

router.use('/health', health);
router.use('/login', login);
router.use('/scrap', scrapper);
router.use('/news', news);

module.exports = router;
