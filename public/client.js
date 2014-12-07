var socket = io();
$('form').submit(function() {
    var inputMessage = $('#m').val();
    if (isChangeNickCommand(inputMessage)) {
        socket.emit('nick change', inputMessage);
    } else if(isSendPrivateMsgCommand(inputMessage)) {
        socket.emit('private message', inputMessage);
        var reciver = parseReciver(inputMessage);
        var parsedMessage = inputMessage.replace('/priv '+reciver+' ','');
        var $element = $('<li class="my-message">').text('whispers to '+reciver+'> ' + parsedMessage);
        $('#messages').append($element);
        scrollPageDown($element);
    } else {
        socket.emit('chat message', inputMessage);
        var $element = $('<li class="my-message">').text('me> ' + inputMessage);
        $('#messages').append($element);
        scrollPageDown($element);
    }
    $('#m').val('');
    return false;
});
socket.on('chat message', function(msg) {
    $('#is-typing').remove();
    var $element = $('<li>').text(msg);
    $('#messages').append($element);
    scrollPageDown($element);
});
socket.on('user action', function(msg) {
    $('#is-typing').remove();
    var $element = $('<li class="user-action">').text(msg);
    $('#messages').append($element);
    scrollPageDown($element);
});
socket.on('writing', function(user) {
    if ($('#is-typing').size() === 0) {
        var $element = $('<li id="is-typing">').text(user + ' is typing');
        $('#messages').append($element);
        setTimeout(function() {
            $('#is-typing').remove();
        }, 1000);
        scrollPageDown($element);
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

var isSendPrivateMsgCommand = function(text) {
    var splittedMsg = text.split(" ");
    return splittedMsg[0] === "/priv";
}

var scrollPageDown = function(element) {
    $('body, html').animate({ scrollTop: element.offset().top }, 1000);
}

var parseReciver = function(inputMessage) {
    return inputMessage.split(' ')[1];
}