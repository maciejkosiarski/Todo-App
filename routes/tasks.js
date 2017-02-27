var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

var Task = require('../models/task');

/* GET tasks listing. */
router.get('/', function(req, res) {
    Task.find({completed:false, _user:req.user._uuid}).sort({created: -1}).populate({ path: 'notes', select: 'desc _uuid'}).exec(function (err, tasks) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not find.</div>');
            res.redirect('/');
        }
        res.render('tasks/index', { 
            page: 'Tasks',
            tasks:tasks,
            messages: req.flash('info')
        });
    });
});

/* GET completed tasks listing. */
router.get('/completed', function(req, res) {
    Task.find({completed:true, _user:req.user._uuid}).sort({created: -1}).exec(function (err, tasks) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not find.</div>');
            res.redirect('/');
        }
        res.render('tasks/completed', { 
            page: 'Completed',
            tasks:tasks,
            messages: req.flash('info')
        });
    });
});

/* POST new task. */
router.post('/', function (req, res) {
    var newTask = new Task({
        _uuid : uuid.v4(),
        name : req.body.name,
        _user : req.user._uuid
    });
    newTask.save(function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not created.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful created.</div>');
        }
        res.redirect('/tasks');
    });
});

router.put('/complete', function (req, res) {
    Task.findOneAndUpdate({_uuid: req.body._uuid},{$set:{completed: true}}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not complted.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful completed.</div>');
        }
        res.redirect('/tasks');
    });
});

router.put('/complete/all', function (req, res) {
    Task.update({completed: false},{$set:{completed: true}}, {multi: true}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not complted.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Tasks was successful completed.</div>');
        }
        res.redirect('/tasks/completed');
    });
});

router.put('/active', function (req, res) {
    Task.findOneAndUpdate({_uuid: req.body._uuid},{$set:{completed: false}}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not activated.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful activated.</div>');
        }
        res.redirect('/tasks/completed');
    });
});

router.put('/active/all', function (req, res) {
    Task.update({completed: true},{$set:{completed: false}}, {multi: true}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not activated.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Tasks was successful activated.</div>');
        }
        res.redirect('/tasks');
    });
});

router.put('/edit', function (req, res) {
    Task.findOneAndUpdate({_uuid: req.body._uuid},{$set: req.body}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful modified.</div>');
        }
        res.redirect('/tasks');
    });
});

router.delete('/', function (req, res) {
    Task.findOne({_uuid: req.body._uuid}, function (err, task) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not removed.</div>');
        } else {
            task.remove();
            req.flash('info', '<div class="alert alert-success">Task was successful removed.</div>');
        }
        res.redirect('/tasks/completed');
    });
});

router.delete('/all', function (req, res) {
    Task.find({ completed: true }, function (err, tasks) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not removed.</div>');
        } else {
            for(var i = 0; i < tasks.length; i++){
                tasks[i].remove();
            }
            req.flash('info', '<div class="alert alert-success">Tasks was successful removed.</div>');
        }
        res.redirect('/tasks');
    });
});

module.exports = router;
