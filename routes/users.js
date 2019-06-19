const express = require('express');
const router = express.Router();
const userModel = require('../model/user/userModel')
const oauthModel = require('../model/oauth/oauthModel')
const errorModel = require('../model/error/errorModel')

// 注册用户
router.post('/register', function (req, res, next) {
    try {
        let userName = req.body.username;
        let password = req.body.password;
        if (userName && password) {
            userName = userName.trim();
            if (!userModel.isLegalUserName(userName)) throw '用户名不合法';

            const register = {
                registration: userName,
                registration_type: 'userName',
                password: password
            }
            userModel.register(register, function (error, result) {
                if (error) {
                    res.end(JSON.stringify(errorModel.getErrorModel(error, 10000)))
                    return;
                }
                res.end(JSON.stringify(errorModel.getErrorModel('注册成功', 200)))
            })

        } else {
            throw '用户名密码不合法';
        }
    } catch (e) {
        res.end(JSON.stringify(errorModel.getErrorModel(e, 10000)))
    }
})

// 获取用户信息
router.get('/userinfo', function (req, res, next) {
    new Promise((resolve, reject) => {
        let userId = req.query.userId;
        if (!userId) {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                oauthModel.getUserIdByAccessToken(token).then(result => {
                    resolve(result[0].userId)
                }).catch(error => {
                    reject(error)
                })

            } else {
                reject()
            }
        } else {
            resolve(userId)
        }
    }).then(userId => {
        userModel.getById(userId, function (error, result) {
            console.log(req.path, 'result', result, 'error', error)
            if (error) {
                res.end(JSON.stringify(errorModel.getErrorModel('error', 10000)));
            } else if (!result) {
                res.end(JSON.stringify(errorModel.getErrorModel('无此用户', 10000)));
            } else {
                res.end(JSON.stringify({data: result, code: 200}));
            }
        })
    }).catch(e => {
        res.end(JSON.stringify(errorModel.getErrorModel('参数错误', 10000)));
    })
})

module.exports = router;
