var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

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
    var newUser = new User({
        _uuid : uuid.v4(),
        nick : req.body.nick,
        pass : User.generateHash(req.body.pass)
    });
    newUser.save(function (err, note) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error: '+err.message+' User was not created.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">User was successful created.</div>');
        }
        res.redirect('/users');
    });
});

router.put('/', function (req, res) {
    User.findOneAndUpdate({_uuid: req.body._uuid},{$set: req.body}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Your data was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Your data was successful modified.</div>');
        }
        res.redirect('/tasks');
    });
});

router.delete('/', function (req, res) {
    User.findOne({_uuid: req.body._uuid}, function (err, user) {
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
