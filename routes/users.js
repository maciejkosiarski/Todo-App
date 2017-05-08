var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    User.find({}).sort({created: -1}).exec(function (err, users) {
        if (err) return next(err);
        res.render('users/index', {
            page:'Users',
            users:users,
            messages: req.flash('info')
        });
    });
});

/* POST new user. */
router.post('/', function (req, res, next) {
    req.checkBody('nick', 'Invalid nick').notEmpty().isAlphanumeric();
    req.checkBody('pass', 'Invalid pass').notEmpty().isLength({min:8});
    var errors = req.validationErrors();
    if(errors) {
        req.flash('info', '<div class="alert alert-danger">Invalid data. Nick(alphanumeric) and pass(length more than 7 char) cant be empty.</div>');
        return res.redirect('/users');
    } else {
        var newUser = new User({
            nick : req.body.nick
        });
        newUser.pass = newUser.generateHash(req.body.pass);
        newUser.save(function (err) {
            if (err) return next(err);
            req.flash('info', '<div class="alert alert-success">User was successful created.</div>');
            res.redirect('/users');
        });
    }
});

router.put('/', uuidValid, function (req, res, next) {
    User.findOneAndUpdate({_id: req.body._id},{$set: req.body}, function (err) {
        if (err) return next(err);
        req.flash('info', '<div class="alert alert-success">Your data was successful modified.</div>');
        res.redirect('/tasks');
    });
});

router.delete('/', uuidValid, function (req, res, next) {
    User.findOne({_id: req.body._id}, function (err, user) {
        if (err) return next(err);
        user.remove();
        req.flash('info', '<div class="alert alert-success">User was successful removed.</div>');
        res.redirect('/users');
    });
});

module.exports = router;

function uuidValid(req, res, next){
    req.checkBody('_id', 'Invalid uuid').notEmpty().isUUID(4);
    var errors = req.validationErrors();
    if(errors) {
        req.flash('info', '<div class="alert alert-danger">Error. UUID is not valid.</div>');
        res.redirect('/users');
    } else {
        return next();
    }
}