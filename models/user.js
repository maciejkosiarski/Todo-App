var sha1 = require('locutus/php/strings/sha1');
var mongoose = require('mongoose');
var config = require('../config/app.js');
var Task = require('../models/task');
var Note = require('../models/note');

var userSchema = mongoose.Schema({
    _uuid: {type: String, default: ""},
    nick: {type: String, unique : true, default: ""},
    email: {type: String, default: ""},
    pass: {type: String, default: ""},
    admin: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    modified: {type: Date, default: Date.now}
});

userSchema.pre('findOneAndUpdate', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

userSchema.pre('update', function (next) {
    var currentDate = new Date();
    this.findOneAndUpdate({},{ $set: { modified: currentDate } });
    next();
});

userSchema.statics.generateHash = function(password){
    return sha1(config.security.salt+password);
};

userSchema.statics.validPassword = function(password, userPassword){
    if(this.generateHash(password) == userPassword){
        return false;
    }
    return true;
};

userSchema.pre('remove', function (next) {
    console.log('wlazlo');
    Note.remove({_user: this._uuid}).exec();
    Task.find({_user: this._uuid}, function(err, tasks){
        for(var i = 0; i < tasks.length; i++){
            tasks[i].remove();
        }
    });  
    next();
});

module.exports = mongoose.model('User', userSchema);