var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
        User.findOne({_id:_id}, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'nick',
            passwordField: 'pass',
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findOne({nick: username}, function (err, user) {
                if (err)  return done(err);
                if (!user) return done(null, false, req.flash('info', '<div class="alert alert-danger">User not found.</div>'));

                if(User.validPassword(password, user.pass)){
                    return done(null, false, req.flash('info', '<div class="alert alert-danger">Invalid password.</div>'));
                }
                req.flash('info', '<div class="alert alert-success">Hello!</div>');
                user.logged = true;
                user.save(function (err) {
                    if (err) { 
                        return done(null, false, req.flash('info', '<div class="alert alert-danger">User not found.</div>'));
                    }
                    else {
                        return done(null, user);
                    }
                });
            }).catch(function(err) {
                console.error(err);
            });
        }
    ));
};
