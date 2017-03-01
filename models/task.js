var mongoose = require('mongoose');
var uuid = require('node-uuid');

var Note = require('./note');

var taskSchema = mongoose.Schema({
    _id: {type: String, unique : true, default: uuid.v4},
    _user : {type: String, ref: 'User'},
    name: {type: String, default: ""},
    desc: {type: String, default: ""},
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
    next();
});

module.exports = mongoose.model('Task', taskSchema);