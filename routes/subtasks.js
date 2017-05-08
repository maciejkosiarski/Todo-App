var express = require('express');
var router = express.Router();

var Task = require('../models/task');
var Subtask = require('../models/subtask');

/* GET notes listing. */
//router.get('/', function(req, res) {
//    Note.find({ _task:false, _user:req.user._id }).sort({created: -1}).exec(function (err, notes) {
//        if(err) return next(err);
//        res.render('notes/index', {
//            page: 'Notes',
//            notes:notes,
//            messages: req.flash('info')
//        });
//    });
//});

/* POST new subtask */
router.post('/', uuidValid, function (req, res, next) {
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

router.put('/complete', uuidValid, function (req, res, next) {
    Subtask.findOneAndUpdate({_id: req.body._id},{$set:{completed: true}}, function (err, subtask) {
        if (err) return next(err);
        var data = {
            info: '<div class="alert alert-success">Subtask '+subtask.name+' was successful completed.</div>',
            subtask: subtask
        };
        res.send(data);
    });
});

router.put('/active', uuidValid, function (req, res, next) {
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
        req.flash('info', '<div class="alert alert-success">Subtask '+subtask.name+' was successful removed.</div>');
        res.redirect('/tasks');
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