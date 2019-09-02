const xml2js = require('xml2js');
const config = require('config');

const helper = require('./util');
const requestHelper = require('../helpers/requestHelper');

const newsHelper = {};
const logger = helper.getLogger('newsHelper');

const parseRedditData = async xml => {
  const data = [];
  xml2js.parseString(xml, (err, result) => {
    const posts = result.feed.entry;
    posts.forEach((item, index) => {
      data.push({
        id: `reddit-${index}`,
        source: 'reddit',
        title: item.title[0],
        link: item.link[0].$.href,
        postedDate: item.updated[0],
        description: '',
        category: item.category[0].$.term,
        contentType: item.content[0].$.type,
        content: item.content[0]._,
      });
    });
  });
  return data;
};

const parseRssData = async (xml, source) => {
  const data = [];
  xml2js.parseString(xml, (err, result) => {
    const posts = result.rss.channel[0].item;
    posts.forEach((item, index) => {
      let category;
      let imageUrl;
      let description = item.description[0];

      if (source === 'engadget' || source === 'gizmodo') {
        // revisit to handle arrays
        // [category] = item.category;

        const imageUrlStr = description;
        const myRegex = /<img[^>]+src="(https:\/\/[^">]+)"/g;
        const imgSrc = myRegex.exec(imageUrlStr);
        [, imageUrl] = imgSrc;

        description = description.replace(/<img[^>]*>/g, '');
      }

      data.push({
        id: `${source}-${index}`,
        source,
        title: item.title[0],
        link: item.link[0],
        postedDate: item.pubDate[0],
        description,
        category,
        contentType: '',
        content: '',
        imageUrl,
      });
    });
  });
  return data;
};

newsHelper.buildNewsOptions = source => {
  const fn = 'buildNewsOptions';
  logger.debug('inside buildNewsOptions()', fn);

  try {
    const options = {
      uri: source.url,
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

newsHelper.buildNewsResponse = async (source, results) => {
  const fn = 'buildNewsResponse';
  logger.debug('inside buildNewsResponse()', fn);

  let formattedResults = results;

  if (source.name === 'reddit') {
    formattedResults = parseRedditData(results);
  } else {
    formattedResults = parseRssData(results, source.name);
  }
  return formattedResults;
};

newsHelper.getNews = async source => {
  const fn = 'getNews';
  logger.info('>>> inside getNews()', fn);

  try {
    const options = newsHelper.buildNewsOptions(source);
    const results = await requestHelper.processRequest(options, fn);
    const news = await newsHelper.buildNewsResponse(source, results);
    return news;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = newsHelper;
