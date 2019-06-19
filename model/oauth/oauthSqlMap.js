module.exports = {
    getAccessToken: `select * from oauth where accessToken=?`,
    getRefreshToken: `select * from oauth where refreshToken=?`,
    saveToken: `insert into oauth(accessToken, accessTokenExpiresAt, clientId, refreshToken, refreshTokenExpiresAt, userId) values(?,?,?,?,?,?)`,
    revokeTokenByUserId: `update oauth set accessTokenExpiresAt=CURRENT_TIMESTAMP() where userId=?`,
    getUserIdByAccessToken: `select userId from oauth where accessToken=?`
}
