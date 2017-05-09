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

/* POST new notification to specific task */
router.post('/', function (req, res, next) {
    req.checkBody('due_date', 'Invalid due date.').notEmpty().isDate();
    var errors = req.validationErrors();
    if(errors) {
        console.log(errors);
        req.flash('info', '<div class="alert alert-danger">'+errors[0].msg+'</div>');
        return res.redirect('/tasks');
    } else {
        Task.findById(req.body._id, function (err, task) {
            if (err) return next(err);
            
            var newNotification = new Notification({
                _user: req.user,
                _task: task,
                browser : req.body.browser,
                email : req.body.email,
                loop : req.body.loop,
                due_date : req.body.due_date
            });
            newNotification.save(function (err, notification) {
                if (err) return next(err);
                
                task.notifications.push(notification._id);
                task.save();
                req.flash('info', '<div class="alert alert-success">Notification was successful created.</div>');
                res.redirect('/tasks');
            });
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