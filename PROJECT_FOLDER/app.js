require('dotenv').config(); // Pastikan ini paling atas agar .env terbaca
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRuter = require('./routes/employee');
var educationRouter = require('./routes/education');
var employeeFamilyRouter = require('./routes/employeeFamily'); 
var employeeProfileRouter = require('./routes/employeeProfile');

var app = express();
const redisClient = require('./config/redis');

redisClient.connect()
  .then(() => console.log(" Redis client connected"))
  .catch((err) => console.error(" Redis client failed to connect:", err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employees', employeeRuter);
app.use('/educations', educationRouter);
app.use('/employee-families', employeeFamilyRouter);
app.use('/employee-profiles', employeeProfileRouter);

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
