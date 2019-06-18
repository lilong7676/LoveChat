const oauthDAO = require('./oauthDAO')
/**
* generateAccessToken
*/

module.exports.generateAccessToken = function(client, user, scope) {

}

/**
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
    return oauthDAO.getAccessToken(bearerToken)
};

/**
 * Get client.
 */

module.exports.getClient = function(clientId, clientSecret) {
    return oauthDAO.getClient(clientId, clientSecret)
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = function(refreshToken) {
    return oauthDAO.getRefreshToken(refreshToken)
};

/**
 * Get user.
 */

module.exports.getUser = function(username, password) {
    return oauthDAO.getUser(username, password)
};

/**
 * Save token.
 */

module.exports.saveToken = function(token, client, user) {
    const accessToken = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client: client,
        clientId: client.id,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        user: {},
        userId: user.userId,
    }
    console.log('saveToken', accessToken)
    return new Promise((resolve, reject) => {
        oauthDAO.saveToken(accessToken).then(result => {
            if (result && result.affectedRows > 0) {
                resolve(accessToken)
            }
        }).catch(error => {
            reject(error)
        })
    })
};
