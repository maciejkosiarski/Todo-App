var cron = require('node-cron');

var config = require('../config/app');
var logger = require('../utils/logger');

cron.schedule('* * * * *', function(){
    console.log('simple test cron by 1 min');
    logger.save(config.logs.cron, 'test');
});

module.exports = cron;


