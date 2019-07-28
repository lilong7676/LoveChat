module.exports = {
    getAccessToken: `select * from oauth where accessToken=?`,
    getRefreshToken: `select * from oauth where refreshToken=?`,
    saveToken: `insert into oauth(accessToken, accessTokenExpiresAt, clientId, refreshToken, refreshTokenExpiresAt, userId) values(?,?,?,?,?,?)`,
    revokeTokenByUserId: `update oauth set accessTokenExpiresAt=CURRENT_TIMESTAMP() where userId=?`,
    revokeToken: `update oauth set accessTokenExpiresAt=CURRENT_TIMESTAMP() where accessToken=?`,
    getUserIdByAccessToken: `select userId from oauth where accessToken=?`,
    getValidAccessToken: `select * from oauth where accessToken=? and accessTokenExpiresAt > CURRENT_TIMESTAMP()`
}
