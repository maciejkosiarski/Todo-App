var cron = require('node-cron');

cron.schedule('*/2 * * * *', function(){
    console.log('test cron by 2 min');
});

module.exports = cron;


