var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');


var userIdx = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 3000));

io.on('connection', function(socket) {

    socket.nick = 'anonymous' + userIdx;
    userIdx++;

    socket.broadcast.emit('user action', 'user ' + socket.nick + ' connected');

    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', socket.nick + "> " + msg);
    });

    socket.on('nick change', function(msg) {
        var oldNick = socket.nick;
        socket.nick = getNick(msg);
        io.emit('user action', 'user ' + oldNick + ' changed his nick to ' + socket.nick);
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('user action', socket.nick + ' disconnected');
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
