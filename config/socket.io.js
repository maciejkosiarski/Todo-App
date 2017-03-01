var User = require('../models/user');
var Message = require('../models/message');

module.exports = function(server){
    var io = require('socket.io')(server);
    
    io.on('connection', function(socket){
        console.log('connect started');
        Message.find().populate('_user').exec(function(err, messages) {
            if(err) throw err;
            socket.emit('output', messages);
        });

        socket.on('chat message', function(msg) {
            var whitespacePattern = /^\s*$/;

            if(whitespacePattern.test(msg.message)) {
                socket.emit('er', "Wiadomość i nazwa użytkownika nie może być pusta.");
            } else {
                var newMessage = new Message({
                    content: msg.message,
                    _user: msg.user
                });
                newMessage.save(function(err, message) {
                    if (err) throw err;
                    User.findById(message._user, function(err, user){
                        io.emit('chat message', {
                            user:user.nick,
                            content:message.content,
                            created:message.created
                        });
                    });                   
                });
            }
        });
        socket.on('disconnect', function(){
            console.log('disconnect');
        });
    });
};


