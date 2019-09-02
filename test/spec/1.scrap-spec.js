process.env.NODE_CONFIG_DIR = './src/config';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'sandbox';
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('config');
const sinon = require('sinon');

const mockData = require('../data/scrap.json');
const scrapperCtrl = require('../../src/app/controllers/scrapper.controller');

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;
const url = `http://${host}:${port}`;

chai.use(chaiHttp);

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('/scrap', () => {
  let token;

  beforeAll(async () => {
    // create fake jwt token for requests
    token = jwt.sign(
      {
        exp:
          Math.floor(Date.now() / 1000) + parseInt(config.jwt_expiretime, 10),
        email: 'test@codinglife.net',
      },
      config.secret,
    );

    // eslint-disable-next-line global-require
    require('../../src/app');
    await timeout(2000); // wait for server to come up fully
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return an array of scraps', async () => {
    // const scrapStub = sinon
    //   .stub(scrapperCtrl, 'scrap')
    //   .resolves(mockData.responseObj);

    const response = await chai
      .request(url)
      .post('/scrap')
      .set('Authorization', `Bearer ${token}`)
      .send(mockData.requestObj);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(jasmine.any(Array));
  });
});
