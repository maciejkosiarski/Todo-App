var express = require('express');
var router = express.Router();

var Notification = require('../models/notification');
var Note = require('../models/note');
var Task = require('../models/task');

/* GET notifications listing. */
//router.get('/', function(req, res, next) {
//    Notification.find().exec(function (err, notifications) {
//        if (err) return next(err);
//        res.render('Notifications/index', {
//            page: 'Notifications',
//            notifications: notifications,
//            messages: req.flash('info')
//        });
//    });
//});

/* POST new single independent note */
router.post('/', function (req, res, next) {
    if(req.body.name === '' || req.body.desc === ''){
        req.flash('info', '<div class="alert alert-danger">Error. Note was not created. Invalid data.</div>');
        return res.redirect('/notes');
    } else {
        var newNote = new Note({
            name : req.body.name,
            desc : req.body.desc,
            _user : req.user._id
        });
        newNote.save(function (err) {
            if (err) return next(err);
            
            req.flash('info', '<div class="alert alert-success">Note '+newNote.name+' was successful created.</div>');
            res.redirect('/notes');
        });
    }
});

/* POST new note to specific task */
router.post('/toTask', uuidValid, function (req, res) {
    Task.findById(req.body._id, function (err, task) {
        if(err || req.body.desc === ''){
            req.flash('info', '<div class="alert alert-danger">Error. Note was not created.</div>');
            return res.redirect('/tasks');
        } else {
            var newNote = new Note({
                name : task.name,
                desc : req.body.desc,
                _task : task._id
            });
            newNote.save(function (err, note) {
                if (err) {
                    req.flash('info', '<div class="alert alert-danger">Error. Note was not created.</div>');
                } else {
                    task.notes.push(note._id);
                    task.save();
                    req.flash('info', '<div class="alert alert-success">Note '+newNote.name+' was successful created.</div>');
                }
                res.redirect('/tasks');
            });
        }
    });
});

router.put('/', uuidValid, function (req, res) {
    Note.findOneAndUpdate({_id: req.body._id},{$set: req.body}, function (err, note) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Note was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Note '+note.name+' was successful modified.</div>');
        }
        res.redirect('/notes');
    });
});

router.delete('/', uuidValid, function (req, res) {
    Note.findOneAndRemove({_id: req.body._id}, function (err, note) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Note was not removed.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Note '+note.name+' was successful removed.</div>');
        }
        res.redirect('/notes');
    });
});

module.exports = router;

function uuidValid(req, res, next){
    req.checkBody('_id', 'Invalid uuid').notEmpty().isUUID(4);
    var errors = req.validationErrors();
    if(errors) {
        req.flash('info', '<div class="alert alert-danger">Error. UUID is not valid.</div>');
        res.redirect('/notes');
    } else {
        return next();
    }
}