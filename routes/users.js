const express = require('express');
const router = express.Router();
const userModel = require('../model/user/userModel')
const errorModel = require('../model/error/errorModel')

// 注册用户
router.post('/register', function (req, res, next) {
    try {
        let userName = req.body.username;
        let password = req.body.password;
        console.log('req', req.body)
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

// 登录
router.get('/login', function (req, res, next) {
    const username = req.query.username;
    const password = req.query.password;
    try {
        if (!username || !password) throw '用户名或密码错误'

        userModel.usernameLogin({username, password}, function (error, result) {
            if (!error) {
                if (result.length > 0) {

                }
            }
        })

    } catch (e) {
        res.end(JSON.stringify(errorModel.getErrorModel(e, 10000)))
    }
    res.end()
})

module.exports = router;
