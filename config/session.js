var expressSession = require('express-session');
var config  = require('./app');

var session = expressSession({
    secret: config.security.session,
    resave: false,
    saveUninitialized: false
});

module.exports = session;