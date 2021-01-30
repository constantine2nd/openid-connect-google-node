const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSesssion = require('express-session');
const passport = require('passport');
const favicon = require('serve-favicon')
const { Issuer, Strategy } = require('openid-client');
const bcrypt = require('bcrypt');
const pseudoRandomValue = bcrypt.genSaltSync(20);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const host = 'http://localhost:3000' 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

Issuer.discover('https://accounts.google.com/.well-known/openid-configuration')
  .then(oidcProvider => {
    var client = new oidcProvider.Client({
      client_id: 'YOUR_CLIENT_ID', // Use https://console.developers.google.com to set it up
      client_secret: 'YOUR_CLIENT_SECRET', // Use https://console.developers.google.com to set it up
      redirect_uris: [`${host}/auth/callback`],
      post_logout_redirect_uris: [`${host}/logout/callback`],
      token_endpoint_auth_method: 'client_secret_post'
    });

    app.use(
      expressSesssion({
        secret: pseudoRandomValue,
        resave: false,
        saveUninitialized: true
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
      'oidc',
      new Strategy({ 
        client,
        params: {
            scope: "openid profile email"
        }    
      }, (tokenset, userinfo, done) => {
        return done(null, tokenset.claims());
      })
    );

    // handles serialization and deserialization of authenticated user
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    // start authentication request
    app.get('/auth', (req, res, next) => {
      passport.authenticate('oidc')(req, res, next);
    });

    // authentication callback
    app.get('/auth/callback', (req, res, next) => {
      passport.authenticate('oidc', {
        successRedirect: '/users',
        failureRedirect: '/'
      })(req, res, next);
    });

    app.use('/users', usersRouter);

    // logout
    app.get('/logout', (req, res) => {
      // clears the persisted user from the local storage
      req.logout();
      // redirects the user to a landing page
      res.redirect('/');
    });


    // catch 404 and forward to error handler
    app.use( (req, res, next) => {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  });

module.exports = app;
