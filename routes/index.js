exports.auth = require('./auth');
exports.users = require('./users');
exports.tasks = require('./tasks');
exports.notes = require('./notes');
exports.authCheck = function(req, res, next){
    if (req.user || req.path==='/auth/login') {
        if(req.path==='/users' && !req.user.admin){
            req.flash('info', '<div class="alert alert-danger">Access denied.</div>');
            res.redirect('/tasks');
        } else {
            next();
        }
    } else {
        req.flash('info', '<div class="alert alert-danger">You are not logged in.</div>');
        res.redirect('/auth/login');
    }
    
};