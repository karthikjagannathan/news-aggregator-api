/**
 * News Controller
 *
 */

const express = require('express');
const bodyParser = require('body-parser');

const helper = require('../helpers/util');
const newsHelper = require('../helpers/newsHelper');

const router = express.Router();
const logger = helper.getLogger('news.controller');

const newsCtrl = {};

const source = {
  reddit: {
    name: 'reddit',
    url: 'https://www.reddit.com/r/technology/.rss',
  },
  bbc: {
    name: 'bbc',
    url: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
  },
  engadget: {
    name: 'engadget',
    url: 'https://www.engadget.com/rss.xml',
  },
  gizmodo: {
    name: 'gizmodo',
    url: 'https://gizmodo.com/rss',
  },
};

router.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

newsCtrl.news = async (req, res) => {
  const fn = 'news';
  logger.info('>>> inside news()', fn);

  const src = req.query.source;

  try {
    let redditNews = [];
    let bbcNews = [];
    let engadgetNews = [];
    let gizmodoNews = [];

    if (src === 'reddit') {
      redditNews = await newsHelper.getNews(source.reddit);
    }
    if (src === 'bbc') {
      bbcNews = await newsHelper.getNews(source.bbc);
    }
    if (!src || src === 'engadget') {
      engadgetNews = await newsHelper.getNews(source.engadget);
    }
    if (!src || src === 'gizmodo') {
      gizmodoNews = await newsHelper.getNews(source.gizmodo);
    }

    res
      .status(200)
      .json([...redditNews, ...bbcNews, ...engadgetNews, ...gizmodoNews]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = newsCtrl;
