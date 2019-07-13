const express = require('express');
const router = express.Router();
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oauth = new OAuth2Server({
    model: require('./../model/oauth/oauthModel')
});

const responseModel = require('../model/response/responseModel')
const oauthModel = require('../model/oauth/oauthModel')

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
        res.end(responseModel.getSuccessModel(result))
    }).catch(error => {
        console.log('/oauth/token error', error)
        res.end(responseModel.getBaseModel(responseModel.invalidTokenCode, '用户名或密码错误'))
    })
});

// 退出登录
router.get('/logout', function (req, res, next) {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        oauthModel.revokeToken(token).then(result => {
            res.end(JSON.stringify({code: 200}))
        }).catch(error => {
            res.end(JSON.stringify({code: 500}))
        })

    } else {
        res.end(JSON.stringify({code: 500}))
    }
})

module.exports = router;
