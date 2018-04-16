'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var surveys = require('./routes/surveys');
var surveys2 = require('./routes/surveys2');
var categories = require('./routes/categories');
var kpis = require('./routes/kpis');
var domains = require('./routes/domains');
var regions = require('./routes/regions');
var countries = require('./routes/countries');
var currencies = require('./routes/currencies');
var industries = require('./routes/industries');
var subindustries = require('./routes/subindustries');
var master = require('./routes/master');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log(__dirname);

app.use('/', index);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/surveys', surveys);
app.use('/surveys2', surveys2);
app.use('/categories', categories);
app.use('/kpis', kpis);
app.use('/domains', domains);
app.use('/regions', regions);
app.use('/countries', countries);
app.use('/currencies', currencies);
app.use('/industries', industries);
app.use('/subindustries', subindustries);
app.use('/master', master);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
