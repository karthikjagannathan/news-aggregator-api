if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'sandbox';
}

const util = require('util');
const httpContext = require('express-http-context');
const uuidv4 = require('uuid');
const helper = require('../helpers/util');

const logger = helper.getLogger('middleware-auth');

const authenticate = async (req, res, next) => {
  const fn = 'authenticate';
  logger.debug('inside authenticate()', fn);

  try {
    // each request to the api is given a unique which will be used as part of logging
    // 'requestId' will be used to track the request across all micro services.
    httpContext.set('requestId', req.correlationId() || uuidv4());

    logger.info(util.format('Request url : - %s ', req.originalUrl), fn);
    // list of unprotected routes. '/health' is used by kubernetes pod for liveness probe.
    if (
      helper.isPathUnprotected(req.originalUrl, [
        'api-docs',
        'favicon.ico',
        'health',
      ])
    ) {
      logger.info(
        `indexOf unprotected routes was found:${req.originalUrl}`,
        fn,
      );
      return next();
    }
  } catch (err) {
    logger.error(`${err.message}`, fn);
    return res.status(500).json({ error: err.message });
  }
  return next();
};

module.exports.authenticate = authenticate;
