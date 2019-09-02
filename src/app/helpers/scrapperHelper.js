const xml2js = require('xml2js');
const config = require('config');
const util = require('util');
const cheerio = require('cheerio');

const helper = require('./util');

const scrapperHelper = {};
const logger = helper.getLogger('scrapperHelper');

const parseData = async xml => {
  const data = [];
  xml2js.parseString(xml, (err, result) => {
    const posts = result.feed.entry;
    posts.forEach((item, i) => {
      if (i === 0) {
        logger.debug(util.inspect(item, false, null));
      }

      data.push({
        index: i,
        id: item.id[0],
        author: item.author[0].name[0],
        category: item.category[0].$.label,
        link: item.link[0].$.href,
        updated: item.updated[0],
        title: item.title[0],
      });
    });
    logger.debug(`Parsed Result: ${JSON.stringify(data)}`);
  });

  return data;
};

const parseDetailData = async html => {
  // logger.debug(html);

  const $ = cheerio.load(html);
  // logger.debug('$', $.html());
  // const data = $('#post-content').html();
  const data = $('[data-test-id=post-content]').html();
  // const data = $('._23h0-EcaBUorIHC-JZyh6J').html();
  logger.debug('data', data);

  // const data = [];
  // xml2js.parseString(xml, (err, result) => {
  //   const posts = result.feed.entry;
  //   posts.forEach((item, i) => {
  //     if (i === 0) {
  //       logger.debug(util.inspect(item, false, null));
  //     }

  //     data.push({
  //       index: i,
  //       id: item.id[0],
  //       author: item.author[0].name[0],
  //       category: item.category[0].$.label,
  //       link: item.link[0].$.href,
  //       updated: item.updated[0],
  //       title: item.title[0],
  //     });
  //   });
  //   logger.debug(`Parsed Result: ${JSON.stringify(data)}`);
  // });

  return data;
};

scrapperHelper.buildScrapOptions = scrapRequest => {
  const fn = 'buildScrapOptions';
  logger.debug('inside buildScrapOptions()', fn);

  try {
    // build http request with uri and body
    const options = {
      uri: scrapRequest.uri,
      method: 'GET',
      json: true,
      timeout: config.timeout,
    };
    return options;
  } catch (err) {
    logger.error(err.message);
    throw new Error(err.message);
  }
};

scrapperHelper.buildScrapResponse = async results => {
  const fn = 'buildScrapResponse';
  logger.debug('inside buildScrapResponse()', fn);

  const scraps = parseData(results);
  return scraps;
};

scrapperHelper.buildDetailResponse = async results => {
  const fn = 'buildDetailResponse';
  logger.debug('inside buildDetailResponse()', fn);

  const scraps = parseDetailData(results);
  return scraps;
};

module.exports = scrapperHelper;
