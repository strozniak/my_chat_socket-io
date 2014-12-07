var socket = io();
$('form').submit(function() {
    var inputMessage = $('#m').val();
    if (isChangeNickCommand(inputMessage)) {
        socket.emit('nick change', inputMessage);
    } else {
        socket.emit('chat message', inputMessage);
        $('#messages').append($('<li class="my-message">').text('me> ' + inputMessage));
    }
    $('#m').val('');
    return false;
});
socket.on('chat message', function(msg) {
    $('#is-typing').remove();
    $('#messages').append($('<li>').text(msg));
});
socket.on('user action', function(msg) {
    $('#is-typing').remove();
    $('#messages').append($('<li class="user-action">').text(msg));
});
socket.on('writing', function(user) {
    if ($('#is-typing').size() === 0) {
        $('#messages').append($('<li id="is-typing">').text(user + ' is typing'));
        setTimeout(function() {
            $('#is-typing').remove();
        }, 1000);
    }
});
socket.on('online users', function(onlineUsers) {
    $('#online-users li').remove();
    for (var idx in onlineUsers) {
        $('#online-users').append($('<li>').text(onlineUsers[idx]));
    }
});


$('#m').on('input', function() {
    socket.emit('writing');
});

var isChangeNickCommand = function(text) {
    var splittedMsg = text.split(" ");
    return splittedMsg[0] === "/nick";
}
