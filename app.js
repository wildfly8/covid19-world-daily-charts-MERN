require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const configDB = require('./config/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('client/build'));
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api', apiRouter);
// If no API routes are hit, send the React app
apiRouter.use(function(req, res) {
	res.sendFile(path.join(__dirname, './client/build/index.html'));
});

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
  res.send('error');
});

//setup mongoDB datasource
mongoose.connect(process.env.MONGODB_URI || configDB.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() =>  console.log('MongoDB covid19 connection successful.'))
.catch((err) => console.error(err))

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Opened DB connection'));
db.once('close', () => console.log('Closed DB connection'));


module.exports = app;