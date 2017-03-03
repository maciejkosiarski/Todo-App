var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res) {
    User.find({}).sort({created: -1}).exec(function (err, users) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Users was not find.</div>');
            res.redirect('/');
        }
        res.render('users/index', {
            page:'Users',
            users:users,
            messages: req.flash('info')
        });
    });
});

/* POST new user. */
router.post('/', function (req, res) {
    req.checkBody('nick', 'Invalid nick').notEmpty().isAlphanumeric();
    req.checkBody('pass', 'Invalid pass').notEmpty().isLength({min:8});
    var errors = req.validationErrors();
    if(errors) {
        req.flash('info', '<div class="alert alert-danger">Invalid data. Nick(alphanumeric) and pass(length more than 7 char) cant be empty.</div>');
    } else {
        var newUser = new User({
            nick : req.body.nick
        });
        newUser.pass = newUser.generateHash(req.body.pass);
        newUser.save(function (err, note) {
            if (err) {
                req.flash('info', '<div class="alert alert-danger">Error: '+err.message+' User was not created.</div>');
            } else {
                req.flash('info', '<div class="alert alert-success">User was successful created.</div>');
            }
        });
    }
    res.redirect('/users');
});

router.put('/', function (req, res) {
    User.findOneAndUpdate({_id: req.body._id},{$set: req.body}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Your data was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Your data was successful modified.</div>');
        }
        res.redirect('/tasks');
    });
});

router.delete('/', function (req, res) {
    User.findOne({_id: req.body._id}, function (err, user) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. User was not removed.</div>');
        } else {
            user.remove();
            req.flash('info', '<div class="alert alert-success">User was successful removed.</div>');
        }
        res.redirect('/users');
    });
});

module.exports = router;
