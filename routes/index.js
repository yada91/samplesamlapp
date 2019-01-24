var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  if(req.isAuthenticated())
    res.render('index', { username: req.user.displayName, mail: req.user.email });
  else
    res.render('index', { username: null});

});

module.exports = router;
