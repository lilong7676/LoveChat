const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oauth = new OAuth2Server({
    model: require('./model/oauth/oauthModel')
});

const indexRouter = require('./routes/index');
const oauthRouter = require('./routes/oauth2')
const usersRouter = require('./routes/users');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 这些path不需要校验token
const authWhitePathList = ['/users/register', '/oauth/token']

app.use(function (req, res, next) {

    console.log('path', req.path)

    res.setHeader('Content-Type','application/json;charset=utf-8');
    if (authWhitePathList.includes(req.path)) {
        // 统一设置响应头
        next();
    } else {
        // 验证token
        let request = new Request({
            method: req.method,
            query: req.query,
            headers: req.headers
        });

        let response = new Response({
            headers: {'Content-Type':'application/json;charset=utf-8'}
        });

        oauth.authenticate(request, response)
            .then((token) => {
                // The request was successfully authenticated.
                console.log('token', token)
                next();
            })
            .catch((err) => {
                // The request failed authentication.
                console.log('error', err)
                res.end(JSON.stringify(err))
            });
    }
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/oauth', oauthRouter);

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

module.exports = app;
