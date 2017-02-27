var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
require('../config/passport.js')(passport);

router.get('/login', function(req, res, next) {
    res.render('auth/login', {
        messages: req.flash('info')
    });
});

router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/tasks', 
        failureRedirect: '/auth/login', 
        failureFlash: true
    }    
));

router.get('/out', function (req, res) {
    req.logout();
    req.flash('info', '<div class="alert alert-success">Bye</div>');
    res.redirect('/auth/login');
});

module.exports = router;
