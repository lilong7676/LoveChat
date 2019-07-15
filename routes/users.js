const express = require('express');
const router = express.Router();
const userModel = require('../model/user/userModel')
const oauthModel = require('../model/oauth/oauthModel')
const resModel = require('../model/response/responseModel')

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
                    res.json(resModel.getErrorModel(error))
                    return;
                }
                res.json(resModel.getSuccessModel())
            })

        } else {
            throw '用户名密码不合法';
        }
    } catch (e) {
        res.json(resModel.getErrorModel(error))
    }
})

// 获取用户信息
router.get('/userinfo', function (req, res, next) {
    new Promise((resolve, reject) => {
        let userId = req.query.userId;
        if (!userId) {
            // 如果没有userId,则根据token获取当前用户信息
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                oauthModel.getUserIdByAccessToken(token).then(result => {
                    if (result) {
                        resolve(result.userId)
                    } else {
                        reject()
                    }
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
                res.json(resModel.getErrorModel(error));
            } else if (!result) {
                res.json(resModel.getErrorModel('无此用户'));
            } else {
                res.json(resModel.getSuccessModel(result));
            }
        })
    }).catch(e => {
        res.json(resModel.getErrorModel('参数错误'));
    })
})

module.exports = router;
