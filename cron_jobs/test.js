var cron = require('node-cron');
var fs = require('fs');

var logger = require('../utils/logger');

cron.schedule('* * * * *', function(){
    console.log('test cron by 2 min');
    logger.save('logs/cron.log', 'test cron by 2 min');
});

module.exports = cron;


