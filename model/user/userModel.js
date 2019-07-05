const userDAO = require('./userDAO')

const self = module.exports = {
    // 用户名密码注册
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
    // 用户名密码登录
    usernameLogin: function (payload, callback) {
        userDAO.usernameLogin(payload, callback)
    },
    add: function (user, callback) {
      userDAO.add(user, function (error, result) {
          callback(null, result)
      })
    },
    // 根据userId获取用户信息
    getById: function (id, callback) {
        userDAO.getById(id, function (error, result) {
            callback(error, result)
        })
    },
    // 更新用户信息
    update: function (user, callback) {
        pool.query(userSqlMap.update, [user.username, user.password, user.id], function (error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    // 获取userId（不对外暴露接口，仅内部使用）
    getUserId: function(accessToken) {
       return new Promise(resolve => {
           userDAO.getUserId(accessToken).then(result => resolve(result))
       })
    },

    // 工具方法
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
