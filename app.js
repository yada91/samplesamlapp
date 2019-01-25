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
        entryPoint: 'https://login.microsoftonline.com/afbe2a25-78bd-4193-8279-95142c1f0169/saml2',
        issuer: 'https://samplesamlapp.herokuapp.com',
        callbackUrl: 'https://samplesamlapp.herokuapp.com/login/callback',
        // cert: fs.readFileSync('./SampleSAMLApp.cer', 'utf-8'),
        cert: 'MIIC8DCCAdigAwIBAgIQOPFi8TlvhIxE0uGtBqOw/jANBgkqhkiG9w0BAQsFADA0\n' +
            'MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZp\n' +
            'Y2F0ZTAeFw0xOTAxMjQyMTA2NDdaFw0yMjAxMjQyMTA2NDdaMDQxMjAwBgNVBAMT\n' +
            'KU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjAN\n' +
            'BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2/7Gk6BN7rvWV2EyrU9rX5/8xSmo\n' +
            'MYgYVqTzh+gFiVzJU1TC6CYybMg+xpouTLDheoUfbDw/0ZsL6qpxYTwd7fUOZ4AC\n' +
            'TzjAOC/W0WDWzhllnMrxE/OgWn6+ihCKkj898wn7AIa54PEYUHGwJHZzFMuO1IFW\n' +
            'TwDQSUNHRe5RuwC2TMPAtVhkGXXCNH6MOAiH+2WlGcPRTZwlxomS5vfqeeoWpw0Y\n' +
            'mtlEW8KGTcTmp73Dj4ijn/cN9/iVdYk9M3Gv9810jknYRG+9c6FNcC/sd1gKFbIM\n' +
            'qHcGBJumv1eTjrmetnE6/TSUgfWlQcFw4q4Uu9gisFgvneC5pOP4SGrgewIDAQAB\n' +
            'MA0GCSqGSIb3DQEBCwUAA4IBAQCPk9WaC4wlyDJOQaL7qljsFOdW8inZQsRN0sFV\n' +
            '+7bkVgeshNbxyvv3bDw3NkJ/eatf2VkAN7jL03HOzi4jftNli0kz2ltCnZUTSo98\n' +
            'TUK6PYTOzp0z2vYLchS77xNh0zxfc02fT/PePp2mYc1rv8h4rmnTG5tNOx81t2UE\n' +
            '1rwekljWAY2bNVb3CnwHwZeAb25xLMdUyBF/Mv+UV1mIbcNeCG2XaKzhL8mPB4fy\n' +
            'nqLMT+UEohPbVN5/WEw8cWtXKfiK1IqDZo11+EHdGafIhcAm8ySUpdtgsA8cunRx\n' +
            'Pf2wNRigBFKLJwP2UkoVwAgS1DmMvhY6nTk2KJN/Q+bLbkFr',
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
