const mysql = require('mysql')
const mysqlConfig = require('../../dbConfig/db')
const oauthSqlMap = require('./oauthSqlMap')
const userDAO = require('./../user/userDAO')

const pool = mysql.createPool(mysqlConfig.mysql)

module.exports = {
    getAccessToken: function (bearerToken) {
        return new Promise((resolve, reject) => {
            pool.query(oauthSqlMap.getAccessToken, bearerToken, function (error, result) {
                console.log('getAccessToken result', result, ' error', error)
                if (error) {
                    reject(error)
                } else {
                    const res = result[0]
                    if (res) {
                        res.user = {userId: res.userId}
                    }
                    resolve(res)
                }
            })
        })
    },
    getClient: function (clientId, clientSecret) {
      return new Promise((resolve, reject) => {
          const result = {id: clientId, grants: ['password'], accessTokenLifetime: 356 * 24 * 3600, refreshTokenLifetime: 356 * 24 * 3600}
          console.log('getClient result', result)
          resolve(result)
      })
    },
    getRefreshToken: function (refreshToken) {
        return new Promise((resolve, reject) => {
            pool.query(oauthSqlMap.getRefreshToken, refreshToken, function (error, result) {
                console.log('getRefreshToken result', result, ' error', error)

                if (error) {
                    reject(error)
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    getUser: function (username, password) {
        return new Promise((resolve, reject) => {
            userDAO.usernameLogin({username, password}, function (error, result) {
                console.log('getUser result', result, ' error', error)
                if (error) {
                    reject(error)
                } else {
                    resolve(result[0])
                }
            })
        })
    },
    saveToken: function ({accessToken, accessTokenExpiresAt, clientId, refreshToken, refreshTokenExpiresAt, userId}) {
        return new Promise((resolve, reject) => {
            pool.query(oauthSqlMap.saveToken, [accessToken, accessTokenExpiresAt, clientId, refreshToken, refreshTokenExpiresAt, userId], function (error, result) {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    },
    deleteTokenByUserId: function (userId) {

    },
    getUserIdByAccessToken: function (accessToken) {
        return new Promise((resolve, reject) => {
            pool.query(oauthSqlMap.getUserIdByAccessToken, accessToken, function (error, result) {
                console.log('getUserIdByAccessToken result', result, 'error', error)
                if (error) {
                    reject(error)
                } else {
                    resolve(result[0])
                }
            })
        })
    }
}
