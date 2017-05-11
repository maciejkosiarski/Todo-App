var fs = require('fs');
var moment = require('moment');

/**
 * Get path to log file and save info from log param
 * @param {string} path
 * @param {string} log
 * 
 */
var save = function(path, log){
    var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    fs.appendFile(path, currentDate+' ---> '+log+'\n');
};

exports.save = save;
