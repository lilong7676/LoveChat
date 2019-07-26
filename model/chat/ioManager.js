class IoManager {
    constructor(server) {
        this.io = require('socket.io')(server);
        this.initIo();
    }

    initIo() {

        this.io.use((socket, next) => {
            let handshake = socket.handshake;
            console.log('io use  handshake', handshake);
            next();
        })

        this.io.on('connection', function (socket) {

            socket.use((packet, next) => {
                console.log('socket use', packet);
                next();
            })

            socket.emit('msg', { hello: 'world' });
            socket.on('msg', function (data) {
                console.log(data);
            });
        })
    }

    authToken(token) {

    }

}

module.exports = IoManager;