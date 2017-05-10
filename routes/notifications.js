var express = require('express');
var router = express.Router();

var Notification = require('../models/notification');
var Task = require('../models/task');

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

router.delete('/', uuidValid, function (req, res, next) {
    Notification.findOneAndRemove({_id: req.body._id}, function (err, notification) {
        if (err) return next(err);
         Task.findById(notification._task, function (err, task) {
            if (err) return next(err);
            var place = task.notifications.indexOf(notification._id);
            task.notifications.splice(place, 1);
            task.save();
            req.flash('info', '<div class="alert alert-success">Notification was successful removed.</div>');
            res.redirect('/tasks');
        });
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