const userDAO = require('./userDAO')

const self = module.exports = {
    register: function(register, callback) {
      userDAO.register(register, function (error, result) {
          if (!error) {
              const userId = result.insertId;
              const user = self.getUserModel(userId, register.registration, register.avatar)
              self.add(user, callback)
          } else {
              callback(error, result)
          }
      })
    },
    usernameLogin: function (payload, callback) {
        userDAO.usernameLogin(payload, callback)
    },
    add: function (user, callback) {
      userDAO.add(user, function (error, result) {
          callback(null, result)
      })
    },
    getById: function (id, callback) {
        userDAO.getById(id, function (error, result) {
            if (error) {
                callback(error)
            } else {
                callback(null, this.getUserModel(null, username, avatar, password))
            }
        })
    },
    update: function (user, callback) {
        pool.query(userSqlMap.update, [user.username, user.password, user.id], function (error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    getUserModel: function (userId, username, avatar) {
        return {
            userId: userId,
            username: username,
            avatar: avatar,
        }
    },
    isLegalUserName: function (username) {
        const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
        return !pattern.test(username);
    }
}
