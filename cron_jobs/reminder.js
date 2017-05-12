var cron = require('node-cron');
var Notification = require('../models/notification');

var config = require('../config/app');
var logger = require('../utils/logger');

module.exports = function(socket){
    cron.schedule('* * * * *', function(){
        if(socket.request.session.passport){
            var currentDate = new Date();
            Notification.find({due_date: {$lt: currentDate}, _user: socket.request.session.passport.user}).populate('_task').exec(function(err, notifications) {
                if(err){
                    logger.save(config.logs.cron, err);
                } else {
                    socket.emit('notifications', notifications);
                }
            });
        }
    });
};
