$('.notify').click((e) => {$(e.target.parentElement).fadeOut('slow', () => $(e.target.parentElement).remove());});
setTimeout(() => {$('.notify').fadeOut('slow', () => $('.notify').remove());}, 5000);