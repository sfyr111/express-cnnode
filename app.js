const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
// const logger = require('morgan'); // 请求日志干掉
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const stylus = require('stylus');

const index = require('./routes/index');
const users = require('./routes/user');
const topicRouter = require('./routes/topic');
require('./services/mongoose_service')
const Errors = require('./error')
const logger = require('./utils/logger').logger

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev')); // 干掉请求日志
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./middlewares/req_log').logRequests())

app.use('/', index);
app.use('/user', users);
app.use('/topic', topicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err instanceof Errors.BaseHTTPError) {
    // throw new Errors.ValidateionError 出来的错误, 自己创建的错误处理
    res.statusCode = err.httpCode
    res.json({
      code: err.CNCode,
      msg: err.httpMsg
    })
  } else {
    // throw new Error 出来的错误
    res.statusCode = 500
    res.json({
      code: Errors.BaseHTTPError.DEFAULT_CNCODE,
      msg: '服务器出错了'
    })
  }
  logger.error('response error to user', err)
})

module.exports = app;
