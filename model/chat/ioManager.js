const oauthModel = require('../oauth/oauthModel');
const userModel = require('../user/userModel');



class IoManager {
    constructor(server) {
        this.io = require('socket.io')(server);
        this.initIo();

        // Save clientScoket to client_io   {socketId: socketObj}
        this.client_socketMap = new Map();
        // save user by socketId
        this.client_userMap = new Map();
        // save token by socketId
        this.client_tokenMap = new Map();
    }

    initIo() {

        this.io.use((socket, next) => {
            let handshake = socket.handshake;
            // console.log('io use  handshake', handshake);
            let token = handshake.query.token;
            if (token) {
                // 获取用户信息
                userModel.getByAccessToken(token).then(user => {
                    if (user) {
                        this.saveUser(socket, user, token);
                        next();
                    } else {
                        next(new Error('获取用户信息失败'));
                    }
                }).catch(e => {
                    next(new Error('系统错误'));
                });
            }
        })

        this.io.on('connection', (socket) => {
            socket.use((packet, next) => {
                console.log('socket use', packet);
                next();
            });

            this.onUserConnected(socket);

            socket.on('disconnect', (reason) => {
                console.log('disconnect reason', reason);
                this.onUserDisconnectd(socket);
            });
        })
    }

    // 用户连接 保存用户信息
    saveUser(socket, user, token) {
        console.log('saveUser', user, token);
        this.client_socketMap.set(socket.id, socket);
        this.client_userMap.set(socket.id, user);
        this.client_tokenMap.set(socket.id, token);
    }

    onUserConnected(socket) {
        if (this.client_socketMap.has(socket.id)) {
            let user = this.client_userMap.get(socket.id);
            // 广播通知此用户上线了
            this.io.emit('onUserConnected', user);

            // 推送当前在线用户列表
            this.notifyCurrOnlineUsers();
        }
    }

    // 用户断开连接
    onUserDisconnectd(socket) {
        let socketId = socket.id;
        if (this.client_socketMap.has(socketId)) {
            let user = this.client_userMap.get(socketId);
            // 删除缓存的用户信息
            this.client_socketMap.delete(socketId);
            this.client_userMap.delete(socketId);
            this.client_tokenMap.delete(socketId);

            // 广播通知此用户下线了
            this.io.emit('onUserDisconnected', user);

            this.notifyCurrOnlineUsers();
        }
    }

    // 通知当前在线用户列表
    notifyCurrOnlineUsers() {
        let userList = [];
        this.client_userMap.forEach((value, key) => {
            userList.push(value);
        });
        this.io.emit('onlineUsers', userList);
    }
}

module.exports = IoManager;