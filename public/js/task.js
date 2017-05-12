document.getElementById("tasks-page").className = 'active-page';


$('.new-subtask').submit(function (e) {
    e.preventDefault();
    var data = {};
    data.name = $(this).find('input[name=name]').val();
    data._id = $(this).find('input[name=_id]').val();
    data._csrf = $(this).find('input[name=_csrf]').val();
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/subtasks',
        success: function (res) {
            $('#info').html(res.info);
            if (res.subtask) {
                var csrf = $('meta[name="_csrf"]').attr('content');
                var html = '<li id="' + res.subtask._id + '"><span>' + res.subtask.name + '</span> ';
                html += '<form class="complete-subtask-form" style="display:inline" ><input type="hidden" name="_id" value="' + res.subtask._id + '"><input type="hidden" name="_csrf" value="'+csrf+'"><button type="submit" class="btn btn-default"><i class="fa fa-check-square-o" aria-hidden="true">Complete</button></form>';
                $('#' + res.subtask._task).prepend(html);
            }
        }
    });
});

$('body').on('submit', 'form.complete-subtask-form', function (e) {
    e.preventDefault();
    var data = {};
    data._id = $(this).find('input[name=_id]').val();
    data._csrf = $(this).find('input[name=_csrf]').val();
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/subtasks/complete',
        success: function (res) {
            $('#info').html(res.info);
            var csrf = $('meta[name="_csrf"]').attr('content');
            var html = '<span style="text-decoration: line-through">' + res.subtask.name + '</span> ';
            html += '<form class="active-subtask-form" style="display:inline"><input type="hidden" name="_id" value="' + res.subtask._id + '"><input type="hidden" name="_csrf" value="'+csrf+'"><button type="submit" class="btn btn-default">Active</button></form> ';
            html += '<form style="display:inline" method="POST" action="/subtasks" ><input type="hidden" name="_method" value="delete"><input type="hidden" name="_id" value="' + res.subtask._id + '"><input type="hidden" name="_csrf" value="'+csrf+'"><button type="submit" class="btn btn-default">Remove</button></form>';
            $('#' + res.subtask._id).html(html);
        }
    });
});

$('body').on('submit', 'form.active-subtask-form', function (e) {
    e.preventDefault();
    var data = {};
    data._id = $(this).find('input[name=_id]').val();
    data._csrf = $(this).find('input[name=_csrf]').val();
    $.ajax({
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/subtasks/active',
        success: function (res) {
            $('#info').html(res.info);
            var csrf = $('meta[name="_csrf"]').attr('content');
            var html = '<span>' + res.subtask.name + '</span> ';
            html += '<form class="complete-subtask-form" style="display:inline"><input type="hidden" name="_id" value="' + res.subtask._id + '"><input type="hidden" name="_csrf" value="'+csrf+'"><button type="submit" class="btn btn-default"><i class="fa fa-check-square-o" aria-hidden="true">Complete</button></form>';
            $('#' + res.subtask._id).html(html);
        }
    });
});
