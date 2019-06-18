module.exports = {
    getErrorModel: function (errorMsg, code) {
        return {
            message: errorMsg,
            code: code
        }
    }
}
