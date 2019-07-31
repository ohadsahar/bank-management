const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3001;

function connect() {
    server.listen(PORT, () => {
        console.log(`Socket io is now live on port ${PORT}`);
    });
}

io.on('connection', function (socket) {
    socket.on('create-transaction', function (data) {
        io.emit('transaction-added', {
            message: data
        });
    });
    socket.on('update-transaction', function (data) {
        io.emit('transaction-updated', {
            message: data
        });
    });
    socket.on('delete-transaction', function (data) {
        io.emit('transaction-removed', {
            message: data
        });
    });
});
connect();
