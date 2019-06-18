module.exports = {
    register: 'insert into user_registration(registration, registration_type, password) values(?, ?, ?)',
    isUsernameRegistered: `select * from user_registration where registration=? and registration_type='username'`,
    usernameLogin: `select * from user_registration where registration=? and registration_type='username' and password=?`,
    add: 'insert into users(user_id, username, avatar) values(?, ?, ?)',
    deleteById: '',
    update: 'update users set username=?, avatar=? where user_id=?',
    list: 'select * from users',
    getById: 'select * from users where user_id = ?'
}
