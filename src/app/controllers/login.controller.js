const jwt = require('jsonwebtoken');

const config = require('config');

const loginCtrl = {};

loginCtrl.login = (req, res) => {
  res.status(200).send('Pending implementation');
};

loginCtrl.fakeLogin = (req, res) => {
  const loginCreds = req.body;

  // create fake jwt token for requests
  const token = jwt.sign(
    {
      email: loginCreds.email,
    },
    config.secret,
  );

  // res.status(200).send('Server is up!');
  res.status(200).json({
    access_token: token,
  });
};

module.exports = loginCtrl;
