const ioManager = {
    initSockeWithServer: function (server) {
        var io = require('socket.io')(server);
        io.on('connection', function (socket) {
            socket.emit('msg', { hello: 'world' });
            socket.on('msg', function (data) {
                console.log(data);
            });
        })

    },
};

module.exports = ioManager;