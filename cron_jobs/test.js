var cron = require('node-cron');
var fs = require('fs');

cron.schedule('* * * * *', function(){
    console.log('simple test cron by 1 min');

});

module.exports = cron;


