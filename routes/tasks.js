var express = require('express');
var router = express.Router();

var Task = require('../models/task');

/* GET tasks listing. */
router.get('/', function(req, res) {
    Task.find({completed:false, _user:req.user._id}).sort({created: -1}).populate('subtasks notes').exec(function (err, tasks) {
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
    Task.find({completed:true, _user:req.user._id}).sort({created: -1}).exec(function (err, tasks) {
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
    if(req.body.name === '') {
        req.flash('info', '<div class="alert alert-danger">Invalid data.</div>');
        res.redirect('/tasks');
    } else {
        var newTask = new Task({
            name : req.body.name,
            _user : req.user._id
        });
        newTask.save(function (err) {
            if (err) {
                req.flash('info', '<div class="alert alert-danger">Error. Task was not created.'+err+'</div>');
            } else {
                req.flash('info', '<div class="alert alert-success">Task was successful created.</div>');
            }
            res.redirect('/tasks');
        });
    }
});

router.put('/complete', uuidValid, function (req, res) {
    Task.findOneAndUpdate({_id: req.body._id},{$set:{completed: true}}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not complted.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful completed.</div>');
        }
        res.redirect('/tasks');
    });    
});

router.put('/complete/all', function (req, res) {
    Task.update({completed: false, _user:req.session.passport.user._id},{$set:{completed: true}}, {multi: true}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not complted.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Tasks was successful completed.</div>');
        }
        res.redirect('/tasks/completed');
    });
});

router.put('/active', uuidValid, function (req, res) {
    Task.findOneAndUpdate({_id: req.body._id},{$set:{completed: false}}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not activated.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful activated.</div>');
        }
        res.redirect('/tasks/completed');
    });
});

router.put('/active/all', function (req, res) {
    Task.update({completed: true, _user:req.session.passport.user._id},{$set:{completed: false}}, {multi: true}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Tasks was not activated.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Tasks was successful activated.</div>');
        }
        res.redirect('/tasks');
    });
});

router.put('/edit', uuidValid, function (req, res) {
    Task.findOneAndUpdate({_id: req.body._id},{$set: req.body}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Task was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Task was successful modified.</div>');
        }
        res.redirect('/tasks');
    });
});

router.delete('/', uuidValid, function (req, res) {
    Task.findOne({_id: req.body._id}, function (err, task) {
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
    Task.find({ completed: true, _user:req.session.passport.user._id }, function (err, tasks) {
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