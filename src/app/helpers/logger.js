/* eslint-disable no-param-reassign */
const log4js = require('log4js');
const config = require('config');
const httpContext = require('express-http-context');

exports.initializeLogger = moduleName => {
  const moduleLogger = log4js.getLogger(moduleName);
  moduleLogger.level = config.logLevel;

  const formatMessage = (message, fn) => {
    message += fn !== undefined ? ` - fn:${fn}` : '';
    message += ` - app:${process.env.APPLICATION_NAME || config.appName}`;
    message += httpContext.get('requestId')
      ? ` - requestId:${httpContext.get('requestId')}`
      : '';
    return message;
  };

  const logger = {
    log: (message, fn) => {
      moduleLogger.log(formatMessage(message, fn));
    },
    error: (message, fn) => {
      moduleLogger.error(formatMessage(message, fn));
    },
    warn: (message, fn) => {
      moduleLogger.warn(formatMessage(message, fn));
    },
    info: (message, fn) => {
      moduleLogger.info(formatMessage(message, fn));
    },
    debug: (message, fn) => {
      moduleLogger.debug(formatMessage(message, fn));
    },
  };

  return logger;
};
