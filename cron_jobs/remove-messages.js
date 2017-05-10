var cron = require('node-cron');
var Message = require('../models/message');

cron.schedule('* * * * *', function(){
    var dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate()-1);
    Message.find({created: {$lt: dayAgo}}).exec(function(err, messages) {
        if(messages.length){
            messages.forEach( function (message){
                message.remove();
                console.log('remove!');
            });
        }
    });
});

module.exports = cron;


