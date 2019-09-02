const scrapperCtrl = {};

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const helper = require('../helpers/util');

const requestHelper = require('../helpers/requestHelper');
const scrapperHelper = require('../helpers/scrapperHelper');

const logger = helper.getLogger('scrapper.controller');

router.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

scrapperCtrl.scrap = async (req, res) => {
  const fn = 'scrap';
  logger.info('>>> inside scrap()', fn);

  try {
    const scrapRequest = req.body;
    logger.debug('request: ', JSON.stringify(scrapRequest));
    // eslint-disable-next-line no-console
    // console.log(JSON.stringify(scrapRequest));
    const options = scrapperHelper.buildScrapOptions(scrapRequest);
    const results = await requestHelper.processRequest(options, fn);
    const scraps = await scrapperHelper.buildScrapResponse(results);

    res.status(200).json(scraps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

scrapperCtrl.details = async (req, res) => {
  const fn = 'details';
  logger.info('>>> inside details()', fn);

  try {
    const detailRequest = req.body;
    logger.debug('request: ', JSON.stringify(detailRequest));
    const options = scrapperHelper.buildScrapOptions(detailRequest);
    const results = await requestHelper.processRequest(options, fn);
    const scraps = await scrapperHelper.buildDetailResponse(results);

    res.status(200).json(scraps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = scrapperCtrl;
