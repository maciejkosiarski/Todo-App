var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
require('../config/passport.js')(passport);

router.get('/signin', notLoggedIn, function(req, res) {
    res.render('auth/signin', {
        messages: req.flash('info')
    });
});

router.post('/signin', notLoggedIn, passport.authenticate('local-login', {
    failureRedirect: '/auth/signin', 
    failureFlash: true
}), function(req, res){
    if(req.session.oldUrl && req.session.oldUrl !== '/'){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/tasks');
    }
});

router.get('/out', function (req, res, next) {
    User.update({_id:req.user._id},{$set:{logged: false}}, function (err) {
        if(err) return next(err);
        req.logout();
        req.flash('info', '<div class="alert alert-success">Bye</div>'); 
        res.redirect('/auth/signin');
    });
});

module.exports = router;

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/tasks');
}