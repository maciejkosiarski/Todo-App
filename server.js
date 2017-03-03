var express         = require('express');
var socketIo        = require('socket.io');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var bodyParser      = require('body-parser');
var moment          = require('moment');
var passport        = require('passport');
var mongoose        = require('mongoose');
var methodOverride  = require('method-override');
var flash           = require('connect-flash');
var csrf            = require('csurf');
var validator       = require('express-validator');

var session = require('./config/session');
var routes  = require('./routes');
var config  = require('./config/app');

var app = express();

var io  = socketIo();
app.io  = io;

app.set('env', config.app.env);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') === 'development') {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(session);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use(function(req, res, next) {
    res.locals._csrf = req.csrfToken();
    res.locals.user = req.user;
    req.session.user = req.user;
    req.session.save();
    return next();
});

app.locals.moment = moment;
app.locals.title = config.app.title;

app.use(express.static(path.join(__dirname, 'public')));
app.use(routes.authCheck);
app.use('/auth', routes.auth);
app.use('/users', routes.users);
app.use('/tasks', routes.tasks);
app.use('/notes', routes.notes);

io.use(function(socket, next){
    session(socket.request, socket.request.res, next);
});

io.on( "connection", function(socket){
    require('./routes/chat')(socket, io);
});

var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

mongoose.Promise = global.Promise;
mongoose.connect(config.database.mongodb.url, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
if (app.get('env') === 'development') {
    db.once('open', function() {
        console.log('db conected');
    });
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    //invalid csrf token
    if (err.code == 'EBADCSRFTOKEN'){
        res.status(err.status || 500);
        res.render('error', {
            message: 'Access denied',
            error: {}
        });
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

module.exports = app;
