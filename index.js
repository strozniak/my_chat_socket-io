var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

var userIdx = 0;
var onlineUsers = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 3000));

io.on('connection', function(socket) {

    socket.nick = 'anonymous' + userIdx;
    userIdx++;
    onlineUsers.push(socket.nick);
    socket.broadcast.emit('user action', 'user ' + socket.nick + ' connected');
    io.emit('online users', onlineUsers);

    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', socket.nick + "> " + msg);
    });

    socket.on('nick change', function(msg) {
        var oldNick = socket.nick;
        onlineUsers = removeFromOnlineUsers(oldNick);
        socket.nick = getNick(msg);
        onlineUsers.push(socket.nick);
        io.emit('user action', 'user ' + oldNick + ' changed his nick to ' + socket.nick);
        io.emit('online users', onlineUsers);
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('user action', socket.nick + ' disconnected');
        onlineUsers = removeFromOnlineUsers(socket.nick);
        io.emit('online users', onlineUsers);
    });

    socket.on('writing', function() {
        socket.broadcast.emit('writing', socket.nick);
    });

});

var port = app.get('port');

http.listen(port, function() {
    console.log('listening on new *:' + port);
});

var getNick = function(msg) {
    var splittedMsg = msg.split(" ");
    return splittedMsg[1];
}

var removeFromOnlineUsers = function(user) {
    return onlineUsers.filter(function(onlineUser) {
        return user !== onlineUser;
    });
}
