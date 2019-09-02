const requestHelper = {};

const request = require('request-promise');
const logHelper = require('../helpers/logger');

requestHelper.sendRequest = async (options, fn) => {
  const logger = logHelper.initializeLogger('sendRequest');
  logger.debug('sendRequest');
  const retryCount = 3;
  let readConflict = false;
  let response = {};
  let count = 0;

  try {
    do {
      try {
        // eslint-disable-next-line no-await-in-loop
        response = await request(options);
        // logger.debug(
        //   `response: ${response !== undefined ? JSON.stringify(response) : ''}`,
        //   fn,
        // );

        readConflict = false;
      } catch (err) {
        logger.error(`${err.message}`, fn);
        if (err.message.indexOf('MVCC_READ_CONFLICT') > -1) {
          readConflict = true;
          count += 1;
          if (count === retryCount) {
            throw new Error(err.message);
          }
        } else {
          throw new Error(err.message);
        }
      }
    } while (readConflict && count < retryCount);
  } catch (err) {
    try {
      if (err.message.split('-').length > 1) {
        throw new Error(JSON.parse(err.message.replace('500 - ', '')).error);
      }
    } catch (errMsg) {
      throw new Error(err.message);
    }
    throw new Error(err.message);
  }

  return response;
};

requestHelper.processRequest = async (options, fn) => {
  const logger = logHelper.initializeLogger('processRequest');
  logger.debug(`options: ${JSON.stringify(options)}`, fn);
  const response = await requestHelper.sendRequest(options, fn);
  return response;
};

module.exports = requestHelper;
