var express = require('express');
var router = express.Router();
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oauth = new OAuth2Server({
    model: require('./../model/oauth/oauthModel')
});

const errorModel = require('../model/error/errorModel')

// 根据用户名密码获取token
router.post('/token', function(req, res, next) {
    let request = new Request({
        method: req.method,
        query: req.query,
        body: req.body,
        headers: req.headers
    });

    let response = new Response({
        headers: {'Content-Type':'application/json;charset=utf-8'}
    });

    oauth.token(request, response).then(result => {
        console.log('/oauth/token result', result)
        res.end(JSON.stringify({token: result, code: 200}))
    }).catch(error => {
        console.log('/oauth/token error', error)
        res.end(JSON.stringify(errorModel.getErrorModel('用户名或密码错误', 10000)))
    })
});

module.exports = router;
