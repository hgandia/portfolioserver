const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;  //Authentication method to authenticate user.
const ExtractJwt = require('passport-jwt').ExtractJwt; /*This is an object that will provide us with several helper methods to
                                                         extract the jw token from a request object.
                                                        */ 
const jwt = require('jsonwebtoken'); //Used to create, sign and verify tokens.
const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user, time=3600) => {
    return jwt.sign(user, config.secretKey, {expiresIn: time});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //Specifies how the token should be extracted from the incoming request object/message.
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts, 
        (jwt_payload, done) => {
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if(err){
                    return done(err, false);
                } else if (user){
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        return next();
    } else {
        err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};