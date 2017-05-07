var mongoose = require('mongoose');
var uuidV4 = require('uuid/v4');


var subtaskSchema = mongoose.Schema({
    _id: {type: String, default: uuidV4},
    _task : {type: String, ref: 'Task'},
    name: {type: String, default: ""},
    completed: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

subtaskSchema.pre('findOneAndUpdate', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

subtaskSchema.pre('update', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

module.exports = mongoose.model('Subtask', subtaskSchema);