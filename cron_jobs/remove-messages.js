var cron = require('node-cron');
var Message = require('../models/message');

var config = require('../config/app');
var logger = require('../utils/logger');

cron.schedule('* 0 * * *', function(){
    var dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate()-1);
    Message.find({created: {$lt: dayAgo}}).exec(function(err, messages) {
        if(err){
            logger.save(config.logs.cron, err);
        } else {
            if(messages.length){
                messages.forEach( function (message){
                    message.remove();
                });
            }
        }
    });
});

module.exports = cron;
