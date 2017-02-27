var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user._uuid);
    });

    passport.deserializeUser(function(_uuid, done) {
        User.findOne({_uuid:_uuid}, function(err, user) {
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
                return done(null, user);
            }).catch(function(err) {
                console.error(err);
            });
        }
    ));
};
