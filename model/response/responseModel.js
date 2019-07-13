const responseCode = {
    success: 200,
    invalidToken: 10000,
    serverError: 500,
}

const responseMsg = {
    success: '成功',
    invalidToken: '登录已过期',
    serverError: '服务器错误',
}

module.exports = {
    getBaseModel: function (code, msg, data) {
        return JSON.stringify(
            {
                code: code,
                message: errorMsg,
                data: data,
            }
        )
    },
    getSuccessModel: function(data) {
        return JSON.stringify(
            {
                code: this.successCode,
                message: responseMsg.success,
                data: data,
            }
        )
    },

    getErrorModel: function(error) {
        return JSON.stringify({
            code: this.serverErrorCode,
            message: error,
        })
    },

    successCode: responseCode.success,
    invalidTokenCode: responseCode.invalidToken,
    serverErrorCode: responseCode.serverError,
  
}
