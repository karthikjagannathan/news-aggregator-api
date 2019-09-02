if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'sandbox';
}

const jwt = require('jsonwebtoken');

const config = require('config');
const helper = require('../helpers/util');

const logger = helper.getLogger('middleware-auth');

const authenticateToken = async (req, res, next) => {
  const fn = 'authenticateToken';
  logger.debug('inside authenticateToken()', fn);

  // read request token
  // let token = req.headers['x-access-token'] || req.headers.authorization;
  // logger.debug('authorizationHeader:', authorizationHeader);

  // skip for unprotected routes
  if (
    helper.isPathUnprotected(req.originalUrl, ['login', 'health', 'api-docs'])
  ) {
    logger.info(
      `Skipping token authorization for unprotected route: ${req.originalUrl}`,
      fn,
    );
    return next();
  }

  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      error: 'invalid_token',
      error_description: 'Token is not valid',
    });
  }

  try {
    const token = authorizationHeader.split(' ')[1]; // Bearer <token>
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
    return next();
  } catch (err) {
    logger.error(`${err.message}`, fn);
    return res.status(400).json({ error: err.message });
  }
};

module.exports.authenticateToken = authenticateToken;
