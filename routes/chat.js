var User = require('../models/user');
var Message = require('../models/message');

module.exports = function(socket, io){  
    var user = socket.request.session.passport.user.nick;
    Message.find().populate('_user').exec(function(err, messages) {
        if(err) throw err;
        socket.emit('messages', messages);
    });

    User.find({logged:true, nick : {$ne: user}}, '-_id nick', null, function(err, users){
        if(err) throw err;
        socket.emit('users', users);
        io.emit('user', socket.request.session.passport.user.nick);
    });

    socket.on('chat message', function(msg) {
        var whitespacePattern = /^\s*$/;
        if(whitespacePattern.test(msg.message)) {
            socket.emit('er', "Write something after send.");
        } else {
            var newMessage = new Message({
                content: msg.message,
                _user: socket.request.session.passport.user
            });
            newMessage.save(function(err, message) {
                if (err) throw err;

                io.emit('chat message', {
                    user:socket.request.session.passport.user.nick,
                    content:message.content,
                    created:message.created
                });               
            });
        }
    });
    socket.on('disconnect', function(){
        io.emit('disconect', user);
    });
    
};


