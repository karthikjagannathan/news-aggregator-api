const express = require('express');

const router = express.Router();
const loginCtrl = require('../controllers/login.controller');

router.post('/', loginCtrl.login);
router.post('/test', loginCtrl.fakeLogin);

module.exports = router;
