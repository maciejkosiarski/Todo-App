var express = require('express');
var router = express.Router();

var Task = require('../models/task');
var Subtask = require('../models/subtask');

/* POST new subtask */
router.post('/', uuidValidAjax, function (req, res, next) {
    //create subtask to specific task
    Task.findById(req.body._id, function (err, task) {
        if(err || req.body.name === ''){
           var info = '<div class="alert alert-danger">Error. Subtask was not created.</div>';
           var data = {};
           data.info = info;
           res.send(data);
        } else {
            var newSubtask = new Subtask({
                name : req.body.name,
                _task : task._id
            });
            newSubtask.save(function (err, subtask) {
                if (err) return next(err);
                task.subtasks.push(subtask._id);
                task.save();
                var data = {
                    info: '<div class="alert alert-success">Subtask '+newSubtask.name+' was successful created.</div>',
                    subtask: subtask
                };
                res.send(data);
            });
        }
    });
});

router.put('/complete', uuidValidAjax, function (req, res, next) {
    Subtask.findOneAndUpdate({_id: req.body._id},{$set:{completed: true}}, function (err, subtask) {
        if (err) return next(err);
        var data = {
            info: '<div class="alert alert-success">Subtask '+subtask.name+' was successful completed.</div>',
            subtask: subtask
        };
        res.send(data);
    });
});

router.put('/active', uuidValidAjax, function (req, res, next) {
    Subtask.findOneAndUpdate({_id: req.body._id},{$set:{completed: false}}, function (err, subtask) {
        if (err) return next(err);
        var data = {
            info: '<div class="alert alert-success">Subtask '+subtask.name+' was successful activated.</div>',
            subtask: subtask
        };
        res.send(data);
    });
});

router.delete('/', uuidValid, function (req, res, next) {
    Subtask.findOneAndRemove({_id: req.body._id}, function (err, subtask) {
        if (err) return next(err);
        Task.findById(subtask._task, function (err, task) {
            if (err) return next(err);
            var place = task.subtasks.indexOf(subtak._id);
            task.subtakss.splice(place, 1);
            task.save();
            req.flash('info', '<div class="alert alert-success">Subtask '+subtask.name+' was successful removed.</div>');
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
        res.redirect('/tasks');
    } else {
        return next();
    }
}

function uuidValidAjax(req, res, next){
    req.checkBody('_id', 'Invalid uuid').notEmpty().isUUID(4);
    var errors = req.validationErrors();
    if(errors) {
        var data = {
            info: '<div class="alert alert-danger">Error. UUID is not valid.</div>'
        };
        res.send(data);
    } else {
        return next();
    }
}