var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userIdx = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

    if (socket.nick === undefined) {
        socket.nick = 'anonymous' + userIdx;
        userIdx++;
    }

    socket.broadcast.emit('user action', 'user ' + socket.nick + ' connected');

    socket.on('chat message', function(msg) {

        if (isChangeNickMsg(msg)) {
            var oldNick = socket.nick;
            socket.nick = getNick(msg);
            io.emit('user action', 'user ' + oldNick + ' changed his nick to ' + socket.nick);
        } else {
            io.emit('chat message', socket.nick + "> " + msg);
        }
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('user action', 'user disconnected');
    });

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});


var isChangeNickMsg = function(msg) {
    var splittedMsg = msg.split(" ");
    return splittedMsg[0] === "/nick";
}

var getNick = function(msg) {
    var splittedMsg = msg.split(" ");
    return splittedMsg[1];
}
