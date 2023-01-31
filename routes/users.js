const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('User: ', req.user)
  next()
})

router.get('/', ensureLoggedIn('/'), (req, res) => {
  res.render('users', { user: req.user });
});

module.exports = router;