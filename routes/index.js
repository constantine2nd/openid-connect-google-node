const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Welcome to OpenID Connect',
    description: 'This is the Node.js web application showing how to configure and enable OpenID Connect middleware in case of Google as the Identity Provider using Express web framework, Passport authentication middleware and openid-client.' 
  });
});

module.exports = router;
