var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var fs = require('fs');

// SAML strategy

var SamlStrategy = require('passport-saml').Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(new SamlStrategy(
    {
      // path: '/login/callback',
        entryPoint: 'https://pmi-e--qa.my.salesforce.com/idp/login?app=0sp1m0000004CAV',
        issuer: 'https://pmi-e--qa.my.salesforce.com',
        callbackUrl: 'https://qa-pmk.cs117.force.com/ConsumerSupport',
        // cert: fs.readFileSync('./SampleSAMLApp.cer', 'utf-8'),
         cert: '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',
        // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
        identifierFormat: null
        // signatureAlgorithm: 'sha256'
    },
    function(profile, done) {
      return done(null,
          {
            id: profile['nameID'],
            email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
            firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
          });
    })
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session(
    {
      resave: true,
      saveUninitialized: true,
      secret: 'sample SAML App'
    }));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/login',
    passport.authenticate('saml', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true})
);
app.post('/login/callback',
    passport.authenticate('saml', {
      failureRedirect: '/',
      failureFlash: true }),
    function(req, res) {
      res.redirect('/');
    }
);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
