const mysql = require('mysql')
const mysqlConfig = require('../../dbConfig/db')
const userSqlMap = require('./userSqlMap')
const oauthDAO = require('./../oauth/oauthDAO')

const pool = mysql.createPool(mysqlConfig.mysql)

const self = module.exports = {
    register: function (register, callback) {
        self.isUsernameRegistered(register.registration, function (error, isUsernameRegistered) {
            if (!error) {
                if (isUsernameRegistered) {
                    callback('用户已注册', null)
                } else {
                    pool.query(userSqlMap.register, [register.registration, register.registration_type || 'username', register.password], function (error, result) {
                        console.log('register result', result, ' error', error)
                        callback(error, result)
                    })
                }
            } else {
                callback(error, null)
            }
        })
    },
    isUsernameRegistered: function (username, callback) {
        pool.query(userSqlMap.isUsernameRegistered, username, function (error, result) {
            if (!error) {
                callback(error, result.length > 0)
            } else {
                callback(error, null)
            }
        })
    },
    usernameLogin: function ({username, password}, callback) {
      pool.query(userSqlMap.usernameLogin, [username, password], function (error, result) {
          console.log('usernameLogin result', result, ' error', error)
          callback(error, result)
      })
    },
    add: function (user, callback) {
        pool.query(userSqlMap.add, [user.userId, user.username, user.avatar], function (error, result) {
            console.log('add result', result, ' error', error)
            callback(error, result)
        })
    },
    getById: function (id, callback) {
        pool.query(userSqlMap.getById, id, function (error, result) {
            console.log('getById id ', id, 'result', result)
            if (error) {
                callback(error, null);
            } else {
                callback(null, result[0]);
            }
        });
    },
    update: function (user, callback) {
        pool.query(userSqlMap.update, [user.username, user.password, user.id], function (error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    getUserId: function (accesssToken) {
        return new Promise((resolve, reject) => {
            oauthDAO.getUserIdByAccessToken(accesssToken).then(result => resolve(result))
        })
    }
}
