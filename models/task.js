var mongoose = require('mongoose');
var Note = require('./note');

var taskSchema = mongoose.Schema({
    _uuid: {type: String, default: ""},
    name: {type: String, default: ""},
    desc: {type: String, default: ""},
    notes: [{ type:  mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    _user : {type: String, ref: 'User'},
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
    Note.remove({_task: this._uuid }).exec();
    next();
});

module.exports = mongoose.model('Task', taskSchema);