var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Note = require('./note');
var Subtask = require('./subtask');

var taskSchema = mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    _user : {type: String, ref: 'User'},
    name: {type: String, default: ""},
    desc: {type: String, default: ""},
    priority: {type: Number, default: 0},
    subtasks: [{ type:  String, ref: 'Subtask' }],
    notes: [{ type:  String, ref: 'Note' }],
    completed: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

taskSchema.pre('findOneAndUpdate', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

taskSchema.pre('update', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

taskSchema.pre('remove', function (next) {
    Note.remove({_task: this._id }).exec();
    Subtask.remove({_task: this._id }).exec();
    next();
});

taskSchema.statics.countActiveSubtasks = function(tasks) {
    for(var i = 0; i < tasks.length; i++){
        var activeSubtasks = 0;
        tasks[i].subtasks.forEach(function(subtask){
            if(!subtask.completed){
                activeSubtasks++;
            }
        });
        tasks[i]['activeSubtasks'] = activeSubtasks;
    };
    return tasks;
};

module.exports = mongoose.model('Task', taskSchema);