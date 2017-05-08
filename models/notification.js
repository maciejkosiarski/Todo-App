var mongoose = require('mongoose');
var uuidV4 = require('uuid/v4');

var notificationSchema = mongoose.Schema({
    _id: {type: String, default: uuidV4},
    _user : {type: String, ref: 'User'},
    _task : { type: String, ref: 'Task'},
    browser: {type: Boolean, default: false},
    email: {type: Boolean, default: false},
    loop: {type: Boolean, default: false},
    due_date: {type: Date, default: Date.now},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

notificationSchema.pre('findOneAndUpdate', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

notificationSchema.pre('update', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

module.exports = mongoose.model('Notification', notificationSchema);