var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    _uuid: {type: String, default: ""},
    content: {type: String, default: ""},
    _user: {type: String, ref: 'User', default: false},
    created: {type: Date, default: Date.now}
});

//noteSchema.pre('save', function(next) {
//...
//});

module.exports = mongoose.model('Message', messageSchema);
