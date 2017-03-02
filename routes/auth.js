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
    User.update({_id:req.user._id},{$set:{logged: false}}, function (err) {
        if(err){
            req.flash('info', '<div class="alert alert-danger">Cant logout. '+err+'</div>'); 
        } else{
            req.logout();
            req.flash('info', '<div class="alert alert-success">Bye</div>'); 
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
