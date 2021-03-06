var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user);
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
        function(req, nick, pass, done) {
            User.findOne({nick: nick}, function (err, user) {
                if (err)  return done(err);
                if (!user) return done(null, false, req.flash('info', '<div class="alert alert-danger">User not found.</div>'));

                if(!user.validPassword(pass, user.pass)){
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
