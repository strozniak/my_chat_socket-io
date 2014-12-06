var socket = io();
$('form').submit(function() {
    var inputMessage = $('#m').val();
    socket.emit('chat message', inputMessage);
    $('#messages').append($('<li class="my-message">').text('me> ' + inputMessage));
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

$('#m').on('input', function() {
    socket.emit('writing');
});
