const appUtil = {};

const logHelper = require('./logger');

/**
 * Checks if the specified path is an unprotected route (like health checks)
 */
appUtil.isPathUnprotected = (text, searchWords) => {
  const searchExp = new RegExp(searchWords.join('|'), 'gi');
  return !!searchExp.test(text);
};

/**
 * Returns the logger based on module name
 */
appUtil.getLogger = moduleName => {
  const moduleLogger = logHelper.initializeLogger(moduleName);
  return moduleLogger;
};

module.exports = appUtil;
