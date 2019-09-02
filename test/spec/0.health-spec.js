process.env.NODE_CONFIG_DIR = './src/config';

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'sandbox';
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const config = require('config');

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;
const url = `http://${host}:${port}`;

chai.use(chaiHttp);

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('server', () => {
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

  describe('/health', () => {
    it('should get success response', async () => {
      const response = await chai
        .request(url)
        .get('/health')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.text).toEqual('Server is up!');
    });
  });
});
