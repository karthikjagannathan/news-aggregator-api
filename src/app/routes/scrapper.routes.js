const express = require('express');

const router = express.Router();
const scrapperCtrl = require('../controllers/scrapper.controller');

router.post('/', scrapperCtrl.scrap);
router.post('/details', scrapperCtrl.details);

module.exports = router;
