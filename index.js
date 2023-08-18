var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var path = require('path');

var contactmeRouter = require('./routes/contactmeRouter');
var usersRouter = require('./routes/usersRouter');
const fileRouter = require('./routes/fileRouter');

const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./config');

//const url = config.mongoUrl; // This is used when connecting locally to MongoDB.
const url = config.mongoConnectionString;

// const connect = mongoose.connect(url, {
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const connect = async () => {
  await mongoose.connect(url, {
   useCreateIndex: true,
   useFindAndModify: false,
   useNewUrlParser: true,
   useUnifiedTopology: true
});
};

connect().catch(err => functions.logger.log(err));

// connect.then(() => {
//   console.log('Connected correctly to MongoDB server'), err => console.log(err);
// });

var app = express();

//Secure Traffic Only
// app.all('*', (req, res, next) => {
//   if(req.secure){
//     return next();
//   } else {
//       console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
//       res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', contactmeRouter);
app.use('/users', usersRouter);
app.use('/files', fileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app; //This works locally, without Google Cloud Functions and have to rename index.js to app.js so that it can work locally.
exports.portfolioserver = app; //This works in conjuction with Google Cloud Functions not locally.  