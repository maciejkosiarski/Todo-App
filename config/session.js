var expressSession = require('express-session');
var mongoStore = require('connect-mongo')(expressSession);
var config  = require('./app');

module.exports = function(dbConnection){
    var session = expressSession({
        secret: config.security.session,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({ mongooseConnection:dbConnection }),
        cookie: { maxAge: 180 * 60 * 1000 }
    });
    return session;
};
