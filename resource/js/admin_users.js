const $ = require('./animation');
var currentDeleteId = null;

$('#modalConfirmDelete').modal();

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
