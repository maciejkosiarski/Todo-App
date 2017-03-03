var express = require('express');
var router = express.Router();

var Note = require('../models/note');
var Task = require('../models/task');

/* GET notes listing. */
router.get('/', function(req, res) {
    Note.find({ _task:false, _user:req.user._id }).sort({created: -1}).exec(function (err, notes) {
        console.log(notes);
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Notes was not find.</div>');
            res.redirect('/');
        }
        res.render('notes/index', {
            page: 'Notes',
            notes:notes,
            messages: req.flash('info')
        });
    });
});

/* POST new note. */
router.post('/', function (req, res) {
    //create note to specific task
    if(req.body._id){
        Task.findById(req.body._id, function (err, task) {
            if(err || req.body.desc === ''){
                req.flash('info', '<div class="alert alert-danger">Error. Note was not created.</div>');
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
                        req.flash('info', '<div class="alert alert-success">Note was successful created.</div>');
                    }

                });
            }
            res.redirect('/tasks');
        });
    //create single independent note
    } else {
        if(req.body.name === '' || req.body.desc === ''){
            req.flash('info', '<div class="alert alert-danger">Error. Note was not created. Invalid data.</div>');
        } else {
            var newNote = new Note({
                name : req.body.name,
                desc : req.body.desc,
                _user : req.user._id
            });
            newNote.save(function (err, note) {
                if (err) {
                    req.flash('info', '<div class="alert alert-danger">Error. Note was not created.</div>');
                } else {
                    req.flash('info', '<div class="alert alert-success">Note was successful created.</div>');
                }

            });
        }
        res.redirect('/notes');
    }
});

router.put('/', function (req, res) {
    Note.findOneAndUpdate({_id: req.body._id},{$set: req.body}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Note was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Note was successful modified.</div>');
        }
        res.redirect('/notes');
    });
});

router.delete('/', function (req, res) {
    Note.findOneAndRemove({_id: req.body._id}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Note was not removed.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Note was successful removed.</div>');
        }
        res.redirect('/notes');
    });
});

module.exports = router;
