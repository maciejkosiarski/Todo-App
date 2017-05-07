var mongoose = require('mongoose');
var uuidV4 = require('uuid/v4');

var messageSchema = mongoose.Schema({
    _id: {type: String, default: uuidV4},
    _user: {type: String, ref: 'User', default: false},
    content: {type: String, default: ""},
    created: {type: Date, default: Date.now}
});

//noteSchema.pre('save', function(next) {
//...
//});

module.exports = mongoose.model('Message', messageSchema);
