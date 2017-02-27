var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');

var Task = require('../models/task');
var Note = require('../models/note');

/* GET notes listing. */
router.get('/', function(req, res) {
    Note.find({ _task:false, _user:req.user._uuid }).sort({created: -1}).exec(function (err, notes) {
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
    //create note tospecific task
    if(req.body._uuid){
        Task.findOne({_uuid:req.body._uuid}, function (err, task) {
            var newNote = new Note({
                _uuid : uuid.v4(),
                name : task.name,
                desc : req.body.desc,
                _task : task._uuid
            });
            newNote.save(function (err, note) {
                if (err) {
                    req.flash('info', '<div class="alert alert-danger">Error. Note was not created.</div>');
                } else {
                    task.notes.push(note._id);
                    task.save();
                    req.flash('info', '<div class="alert alert-success">Note was successful created.</div>');
                }
                res.redirect('/tasks');
            });
        }); 
    //create single independent note
    } else {
        var newNote = new Note({
            _uuid : uuid.v4(),
            name : req.body.name,
            desc : req.body.desc,
            _user : req.user._uuid
        });
        newNote.save(function (err, note) {
            if (err) {
                req.flash('info', '<div class="alert alert-danger">Error. Note was not created.</div>');
            } else {
                req.flash('info', '<div class="alert alert-success">Note was successful created.</div>');
            }
            res.redirect('/notes');
        });
    }
});

router.put('/', function (req, res) {
    Note.findOneAndUpdate({_uuid: req.body._uuid},{$set: req.body}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Note was not modified.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Note was successful modified.</div>');
        }
        res.redirect('/notes');
    });
});

router.delete('/', function (req, res) {
    Note.findOneAndRemove({_uuid: req.body._uuid}, function (err) {
        if (err) {
            req.flash('info', '<div class="alert alert-danger">Error. Note was not removed.</div>');
        } else {
            req.flash('info', '<div class="alert alert-success">Note was successful removed.</div>');
        }
        res.redirect('/notes');
    });
});

module.exports = router;
