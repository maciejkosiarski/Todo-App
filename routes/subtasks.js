var express = require('express');
var router = express.Router();

var Task = require('../models/task');
var Subtask = require('../models/subtask');

/* GET notes listing. */
//router.get('/', function(req, res) {
//    Note.find({ _task:false, _user:req.user._id }).sort({created: -1}).exec(function (err, notes) {
//        console.log(notes);
//        if (err) {
//            req.flash('info', '<div class="alert alert-danger">Error. Notes was not find.</div>');
//            res.redirect('/');
//        }
//        res.render('notes/index', {
//            page: 'Notes',
//            notes:notes,
//            messages: req.flash('info')
//        });
//    });
//});

/* POST new subtask */
router.post('/', uuidValid, function (req, res) {
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
                var info = '';
                if (err) {
                    info = '<div class="alert alert-danger">Error. Subtask was not created.</div>';
                } else {
                    task.subtasks.push(subtask._id);
                    task.save();
                    info = '<div class="alert alert-success">Subtask was successful created.</div>';
                }
                var data = {};
                data.info = info;
                data.subtask = subtask;
                res.send(data);
            });
        }
    });
});

router.put('/complete', uuidValid, function (req, res) {
    Subtask.findOneAndUpdate({_id: req.body._id},{$set:{completed: true}}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Subtask was not complted.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Subtask was successful completed.</div>');
        }
        res.redirect('/tasks');
    });
});

router.put('/active', uuidValid, function (req, res) {
    Subtask.findOneAndUpdate({_id: req.body._id},{$set:{completed: false}}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Subtask was not activated.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Subtask was successful activated.</div>');
        }
        res.redirect('/tasks');
    });
});

router.delete('/', uuidValid, function (req, res) {
    Subtask.findOneAndRemove({_id: req.body._id}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Subtask was not removed.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Subtask was successful removed.</div>');
        }
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