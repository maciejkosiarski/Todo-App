var mongoose = require('mongoose');

var noteSchema = mongoose.Schema({
    _uuid: {type: String, default: ""},
    name: {type: String, default: ""},
    desc: {type: String, default: ""},
    _user : {type: String, ref: 'User', default: false},
    _task : { type: String, ref: 'Task', default: false },
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

noteSchema.pre('findOneAndUpdate', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

noteSchema.pre('update', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

module.exports = mongoose.model('Note', noteSchema);