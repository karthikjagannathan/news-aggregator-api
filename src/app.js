if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'sandbox';
}

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const httpContext = require('express-http-context');
const correlator = require('express-correlation-id');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = YAML.load(`${__dirname}/./api/swagger.yaml`);

const host = process.env.HOST || config.host;
const port = process.env.PORT || config.port;

const app = express();

const routes = require('./app/routes/index.routes');
const helper = require('./app/helpers/util');
const auth = require('./app/middlewares/auth');
const tokenAuth = require('./app/middlewares/tokenAuth');

const logger = helper.getLogger('server');

app.options('*', cors());
app.use(cors());

// body parser to support larger payloads
app.use(
  bodyParser.json({
    limit: '50mb',
    extended: true,
  }),
);
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  }),
);

app.use(httpContext.middleware);
app.use(correlator());

app.use(helmet());

// routes and middleware
app.use(tokenAuth.authenticateToken);
app.use(auth.authenticate);
app.use(routes);

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = http.createServer(app).listen(port, async () => {
  logger.info(`SERVER STARTED at http://${host}:${port}`);
});

server.timeout = 240000;
