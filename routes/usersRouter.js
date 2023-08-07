const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
const cors = require('./cors');

const usersRouter = express.Router();

/* GET users listing. */
usersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
      User.find()
      .then(users => {
        if(!users){
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end('There are no users!');
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(users);
        }
      })
      .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
      User.deleteMany()
      .then(response => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
      
      })
      .catch(err => next(err));
});

usersRouter.route('/signup')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.post(cors.corsWithOptions, (req, res) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        } else {
          if(req.body.firstname){
            user.firstname = req.body.firstname;
          }
          if(req.body.lastname){
            user.lastname = req.body.lastname;
          }
          if(req.body.admin){
            user.admin = req.body.admin; 
          }          
          user.save(err => {
            if(err){
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
              return;
            }
            passport.authenticate('local')(req, res, () => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({ success: true, status: 'Registration Successful!' });
            });
          });
        }
      }
    );
});

/*usersRouter.route('/login')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
      const token = authenticate.getToken({ _id: req.user._id });
      console.log('req.user: ', req.user);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, token: token, status: 'You are succesfully logged in!' });
});*/

usersRouter.route('/login')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.post(cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
            success: false,
            status: 'Login Unsuccessful!',
            err: info
        });
    }
    req.logIn(user, (err) => {
        if (err) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({
                success: false,
                status: 'Login Unsuccessful!',
                err: 'Could not log in user!'
            });
        }
        const token = authenticate.getToken({ _id: user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.json({
            success: true,
            token: token,
            id: req.user._id,
            status: 'You are successfully logged in!'
        });
    });
})(req, res, next);
});

usersRouter.route('/logout')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    authenticate.getToken({ _id: req.user._id }, 0);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You have successfully logged out!'});
});

usersRouter.route('/checkJWTtoken')
.options(cors.corsWithOptions, (req, res) => res.statusCode(200))
.get(cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
          return next(err);
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      if (!user) {
          return res.json({ status: 'JWT invalid!', success: false, err: info });
      } else {
          return res.json({ status: 'JWT valid!', success: true, user: user });
      }
  })(req, res);
});

module.exports = usersRouter;
