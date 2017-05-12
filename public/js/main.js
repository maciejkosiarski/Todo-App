$(document).ready(function () {
    $('#chatModal').on('shown.bs.modal', function () {
        $('#message').focus();
    });
    var socket = io();
    socket.on('messages', function (messages, err) {
        if (messages.length) {
            for (var i = 0; i < messages.length; i++) {
                var html = '<div class="message-row">';
                html += '<div class="message-row-user">' + messages[i]._user.nick + ' <span style="float:right">' + moment(messages[i].created).format('YYYY-MM-DD HH:mm') + '</span></div>';
                html += '<span>' + messages[i].content + '</span>';
                html += '</div>';
                $('#messages').append(html);
            }
        }
    });

    socket.on('users', function (users, err) {
        if (users.length) {
            for (var i = 0; i < users.length; i++) {
                $('#users').append('<li>' + users[i].nick + '</li>');
            }
        }
    });

    socket.on('user', function (user, err) {
        $('#users').append('<li>' + user + '</li>');
    });

    $('#chatForm').submit(function () {
        socket.emit('chat message', {
            message: $('#message').val()
        });

        $('#message').val('');
        return false;
    });

    socket.on('chat message', function (msg) {
        var html = '<div class="message-row">';
        html += '<div class="message-row-user">' + msg.user + ' <span style="float:right">' + moment(msg.created).format('HH:mm:ss') + '</span></div>';
        html += '<span>' + msg.content + '</span>';
        html += '</div>';
        $('#messages').append(html);
        $("html, body").scrollTop($(document).height());
    });

    socket.on('disconect', function (user, er) {
        $('li:contains("' + user + '")').remove();
    });

    socket.on('er', function (er) {
        $('#info').html('<div class="alert alert-danger">' + er + '</div>');
    });
    
    socket.on('notifications', function (data) {
        notify(data);
    });

});

function notify(notifications) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        for(var i = 0; i < notifications.length; i++){
            var options = {
                icon: './img/reminder-icon.png',
                body: notifications[i]._task.name,
                dir: "ltr"
            };
            var notification = new Notification('Todo App', options);
            if(!notifications[i].loop){
                removeNotification(notifications[i]._id);
            }
        }
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
            if (permission === "granted") {
                for(var i = 0; i < notifications.length; i++){
                    var options = {
                        icon: './img/reminder-icon.png',
                        body: notifications[i]._task.name,
                        dir: "ltr"
                    };
                    var notification = new Notification('Todo App', options);
                    if(!notifications[i].loop){
                        removeNotification(notifications[i]._id);
                    }
                }
            }
        });
    }
}

function removeNotification(id) {
    $.ajax({
        url: '/notifications/ajax',
        type: 'DELETE',
        data: {
            _id: id,
            _csrf: $('meta[name="_csrf"]').attr('content')
        }
    });
}