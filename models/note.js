var mongoose = require('mongoose');
var uuidV4 = require('uuid/v4');

var noteSchema = mongoose.Schema({
    _id: {type: String, default: uuidV4},
    _user : {type: String, ref: 'User', default: false},
    _task : { type: String, ref: 'Task', default: false },
    name: {type: String, default: ""},
    desc: {type: String, default: ""},
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