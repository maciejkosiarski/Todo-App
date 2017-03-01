var mongoose = require('mongoose');
var uuid = require('node-uuid');

var messageSchema = mongoose.Schema({
    _id: {type: String, default: uuid.v4},
    _user: {type: String, ref: 'User', default: false},
    content: {type: String, default: ""},
    created: {type: Date, default: Date.now}
});

//noteSchema.pre('save', function(next) {
//...
//});

module.exports = mongoose.model('Message', messageSchema);
