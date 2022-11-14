const $ = require('./animation');
var currentDeleteId = null;
var currentSuspendId = null;
var bulkIds = {};

$('#modalConfirmDelete').modal();
$('#modalConfirmBulkDelete').modal();
$('#modalConfirmSuspend').modal();

$('button[btn-delete-user]').on('click touch', function(e) {
    var message = $('#modalConfirmDelete').data('message');
    currentDeleteId = $(this).data('id');
    message = message.replace(':username', $(this).data('username'));
    $('#modalConfirmDelete').find('h3').text(message);
    $('#modalConfirmDelete').showModal();
});

$('#modalConfirmDelete button[btn-submit]').on('click touch', function(e) {
    if (!currentDeleteId)
        return;

    $.ajax({
        url: `/admin/users/${currentDeleteId}`,
        method: 'DELETE',
        data: {
            csrf: $('meta[name="csrf-token"]').attr('content'),
        },
        success: res => location.reload(),
        error: e => console.log(e),
    })
});

$('#modalConfirmDelete button[btn-close]').on('click touch', function(e) {
    $('#modalConfirmDelete').closeModal();
});

$('button[btn-suspend-user]').on('click touch', function(e) {
    var message = $('#modalConfirmSuspend').data('message');
    currentSuspendId = $(this).data('id');
    message = message.replace(':username', $(this).data('username'));
    $('#modalConfirmSuspend').find('h3').text(message);
    $('#modalConfirmSuspend').showModal();
});

$('#modalConfirmSuspend button[btn-submit]').on('click touch', function(e) {
    if (!currentSuspendId)
        return;

    $.ajax({
        url: `/admin/users/suspend/${currentSuspendId}`,
        method: 'PUT',
        data: {
            csrf: $('meta[name="csrf-token"]').attr('content'),
        },
        success: res => location.reload(),
        error: e => console.log(e),
    })
});

$('#modalConfirmSuspend button[btn-close]').on('click touch', function(e) {
    $('#modalConfirmSuspend').closeModal();
});

$('#checkboxAll').on('input', function(e) {
    if (this.checked) {
        $('input[checkbox-normal]').each(function() {
            bulkIds[$(this).data('id')] = $(this).data('id');
            $(this).prop('checked', true);
        });
    } else {
        bulkIds = {};
        $('input[checkbox-normal]').prop('checked', false);
    }
})

$('input[checkbox-normal]').on('input', function(e) {
    if (this.checked) { 
        bulkIds[$(this).data('id')] = $(this).data('id');
    } else {
        delete bulkIds[$(this).data('id')];
    }
})

$('#bulkDeleteBtn').on('click touch', function(e) {
    if (Object.keys(bulkIds).length)
        $('#modalConfirmBulkDelete').showModal();
});

$('#bulkSuspendBtn').on('click touch', function(e) {
    if (Object.keys(bulkIds).length)
        $('#modalConfirmBulkSuspend').showModal();
});

$('#modalConfirmBulkDelete button[btn-submit]').on('click touch', function(e) {
    if (!Object.keys(bulkIds).length)
        return;

    $.ajax({
        url: `/admin/users`,
        method: 'DELETE',
        data: {
            csrf: $('meta[name="csrf-token"]').attr('content'),
            ids: Object.keys(bulkIds),
        },
        success: res => location.reload(),
        error: e => console.log(e),
    })
});

$('#modalConfirmBulkSuspend button[btn-submit]').on('click touch', function(e) {
    if (!Object.keys(bulkIds).length)
        return;

    $.ajax({
        url: `/admin/users/suspend`,
        method: 'PUT',
        data: {
            csrf: $('meta[name="csrf-token"]').attr('content'),
            ids: Object.keys(bulkIds),
        },
        success: res => location.reload(),
        error: e => console.log(e),
    })
});
