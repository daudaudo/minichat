const $ = require('./animation');
const dayjs = require('dayjs');
import tippy from 'tippy.js';
const maxLengthContent = 300;

const callbacks = {
    connection: (data) => {
        console.log(data);
    },
    public: (evt) => {
        switch (evt.type) {
            case 'post_created':
                if (!filterPost.owner || filterPost.owner == evt.data.post.owner._id)
                    $('#postsList').prepend(renderPost(evt.data.post));
                break;
            case 'get_posts_list':
                evt.data.posts?.forEach(post => {
                    $('#postsList').append(renderPost(post))
                })
                break;
            case 'changed_post':
                if (evt.data.post.like[authUser.user._id])
                    $(`#postsList [data-post-id="${evt.data.post._id}"]`).find('button[btn-like-post]').addClass('active');
                else 
                    $(`#postsList [data-post-id="${evt.data.post._id}"]`).find('button[btn-like-post]').removeClass('active');
                $(`#postsList [data-post-id="${evt.data.post._id}"]`).find('p[like-count]').text(Object.keys(evt.data.post.like).length.toString());
                break;
            case 'get_comment_list':
                var commentsListDom = $(`#postsList [data-post-id="${evt.data.parent_post}"]`).find('[comments-list]')
                commentsListDom.empty()
                evt.data.comments.forEach(comment => commentsListDom.append(renderCommentView(comment)));
                break;
            case 'changed_comment':
                if(evt.data.like == 1){
                    $(`[comments-list] [comment-id="${evt.data.comment._id}"]`).find('button[btn-like-comment]').addClass('active');
                } else {
                    $(`[comments-list] [comment-id="${evt.data.comment._id}"]`).find('button[btn-like-comment]').removeClass('active');
                }
                break;
            case 'comment_created':
                $(`#postsList [data-post-id="${evt.data.comment.parent_post}"]`).find('[comments-list]').prepend(renderCommentView(evt.data.comment))
                break;
            case 'delete_post':
                refreshPostList();
                break;
            case 'edit_post':
                refreshPostList();
                break;
            case 'delete_comment':
                refreshPostList();
                break;
            default:
                console.log(evt);
                break;
        }
    },
    post_created: () => {
        $('#contentInput').val('');
        $('#remainingContentLengthText').text(maxLengthContent - $('#contentInput').val().length);
    },
    connect: () => {
        $('#postsList').empty();
        socket.emit('get_posts_list', filterPost ?? {});
    }
}

const socket = require('../dependencies/pusher')(callbacks);

$('#createPostBtn').on('click touch', function(e) {
    var content = $('#contentInput').val().trim();
    if (content.length)
        socket.emit('create_post', {content});
    else 
        $('#contentInput').val('');
});

$('#contentInput').on('input', function(e) {
    $('#remainingContentLengthText').text(maxLengthContent - $(this).val().length);
})

function renderCommentView(comment) {
    var likeComment = comment.like[authUser.user._id] ? true : false;
    var isUserComment = comment.owner._id == authUser.user._id ? true : false;
    var commentDom = $(`
        <div comment-id="${comment._id}" class="bg-white text-black antialiased flex max-full font-medium">
            <a href="/wall/${comment.owner._id}" class="block">
                <img class="rounded-full h-8 w-8 object-cover mr-2 mt-1 " src="${comment.owner.picture}"/>
            </a>
            <div>
                <div class="bg-gray-100 dark:bg-gray-700 px-4 pt-2 pb-2.5" style="background-color: #F1F5F9; border-radius: 20px;">
                    <div class="font-bold text-sm leading-relaxed" style="color: #334155;">${comment.owner.username}</div>
                    <span comment-content contenteditable="false" class="text-base font-medium text-slate-700 leading-snug md:leading-normal w-fit">${comment.content}</span>
                    <div class="text-xs font-medium mt-0.5 text-slate-400">${dayjs(comment.created_at).format('DD-MM-YYYY HH:mm:ss')}</div>
                </div>
                <div class="flex ml-1.5">
                <div class="flex flex-wrap justify-center space-x-1">
        <div class="">
          <svg class="w-4 h-4 fill-red-400" xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"/></svg>
        </div>
        <p class="font-medium text-slate-700 text-sm">${Object.keys(comment.like).length}</p>
      </div>
                    <button btn-like-comment class="flex items-center ${likeComment != true ? "" : "active"}">
                        <p like class="text-sm  ml-4 font-semibold ${likeComment != true ? "" : "active"}">Like</p>
                    </button>
                    <button btn-edit-comment class="flex items-center text-slate-700 ${isUserComment ? "visible" : "invisible"}">
                        <p like class="text-sm  ml-4 font-semibold">Edit</p>
                    </button> 
                    <button btn-delete-comment class="flex items-center text-red-600 ${isUserComment ? "visible" : "invisible"}">
                        <p like class="text-sm  ml-4 font-semibold">Delete</p>
                    </button> 
                </div>
            </div>
        </div>
    `);

    commentDom.find('button[btn-like-comment]').on('click touch', function(e) {
        socket.emit('like_comment', comment._id);
        refreshPostList();
    });

    commentDom.find('button[btn-edit-comment]').on('click touch', function(e) {
        commentDom.find('span[comment-content]').attr('contenteditable', true).trigger('focus');
    });

    commentDom.find('span[comment-content]').on('keypress', function(e) {
        var content = $(this).text().trim();
        if(e.key == 'Enter'){
            if(content.length){
                e.preventDefault()
                var data = {content : content, comment_id: comment._id}
                $(this).attr('contenteditable', false);
                socket.emit('update_comment', data);    
            }
        }
    });

    commentDom.find('button[btn-delete-comment]').on('click touch', function(e) {
        socket.emit('delete_comment', comment._id)
    })

    return commentDom;
}

function refreshPostList() {
    $('#postsList').empty();
    socket.emit('get_posts_list', filterPost ?? {});
}

function renderPost(post) {
    var likedPost = post.like[authUser.user._id] ? true : false;
    var postDom = $(`
        <div data-post-id="${post._id}" class="p-4 shadow-md rounded-md bg-white mb-8">
            <div class="flex items-center space-x-2 mb-4">
                <a href="/wall/${post.owner._id}"><img src="${post.owner.picture}" class="w-12 h-12 object-cover rounded-full" alt="" srcset=""></a>
                <div class="">
                    <p class="text-slate-500 text-sm font-semibold">${post.owner.username}</p>
                    <p class="text-slate-400 font-medium text-xs">${dayjs(post.created_at).format('DD-MM-YYYY HH:mm:ss')}</p>
                </div>
            </div>
            <div div-content-${post._id}>
                <p content-${post._id} class="text-slate-500 font-medium text-base pb-3 border-b border-slate-300">${post.content}</p>
            </div>
            <div class="flex items-center justify-between mt-3 border-b border-slate-300 pb-3">
                <div class="flex space-x-3">
                    <button btn-like-post class="flex items-center ${likedPost ? "active" : ""}">
                        <p like-count class="text-sm text-slate-700 ml-2 font-semibold">${Object.keys(post.like).length}</p>
                    </button>
                    <button class="flex items-center text-slate-600 hover:text-red-400">
                        <svg fill="currentColor" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512"><path d="M16.514,4.213c-1.122-.953-2.282-1.937-3.446-3.1L12,.048,10.941,1.114a14.411,14.411,0,0,0-3.317,6.1c-.015-.052-.029-.1-.043-.157L6.947,4.6,5.1,6.334C3.245,8.073,1.531,10.154,1.53,13.58A10.376,10.376,0,0,0,9.3,23.711a10.984,10.984,0,0,0,2.69.337A10.464,10.464,0,0,0,22.47,13.582C22.47,9.27,19.709,6.926,16.514,4.213Zm.069,15.261c-.109.084-.225.154-.337.232a4.584,4.584,0,0,0,.35-1.753c0-2.539-2.3-3.552-4.6-5.85-2.507,2.507-4.6,3.311-4.6,5.85A4.574,4.574,0,0,0,7.8,19.8,7.469,7.469,0,0,1,4.536,13.58a5.463,5.463,0,0,1,1.137-3.449c.109.172.224.338.346.5a2.253,2.253,0,0,0,2.32.854A2.314,2.314,0,0,0,10.1,9.7a15.809,15.809,0,0,1,2.043-5.316c.844.776,1.67,1.477,2.426,2.12,3.218,2.731,4.9,4.287,4.9,7.078A7.423,7.423,0,0,1,16.583,19.474Z"/></svg>
                    </button>
                </div>
                <div>
                    <button setting-post class="text-slate-700">
                        <svg class="w-5 h-5 object-center object-contain" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="512" height="512">
                            <g>
                                <circle cx="256" cy="53.333" r="53.333"/>
                                <circle cx="256" cy="256" r="53.333"/>
                                <circle cx="256" cy="458.667" r="53.333"/>
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="bg-white text-black p-4 antialiased flex items-center mt-3" >
                <img class="rounded-full h-8 w-8 mr-2" src="${authUser.user.picture}" />
                <span contenteditable="true" comment-input class="text-normal font-medium text-slate-700 text-base leading-snug md:leading-normal bg-gray-100 w-full pt-2 pb-2.5 px-4" style="color: #334155;background-color: #F1F5F9;max-width:95%;border-radius: 20px;"></span>
            </div>
           
            <div comments-list data-post-id="${post._id}" class="px-4 space-y-4 pt-2 w-full">

            </div>
        </div>
    `);

    postDom.find('button[btn-like-post]').on('click touch', function(e) {
        socket.emit('like_post', post._id);
    });

    for(let comment of Object.values(post.comments)) {
        postDom.find('[comments-list]').append(renderCommentView(comment))
    }

    var commentInput = postDom.find('span[comment-input]')

    commentInput.on('keypress', function(e) {
        var content = commentInput.text().trim()
        if(e.key == 'Enter'){
            if(content.length){
                e.preventDefault()
                var data = {content : content, parent_post: post._id}
                commentInput.text('')
                socket.emit('create_comment', data);    
            }
        }
    });

    var settingPopper = tippy(postDom.find('button[setting-post]')[0], {
        allowHTML: true,
        trigger: 'mouseenter',
        content: `
            <div class="py-2 min-w-32">
                <div class="-mx-1">
                    <button btn-edit-post class="px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-sky-600 block w-full font-medium text-left text-base rounded-md">
                        Edit post
                    </button>
                </div>
                <div class="-mx-1">
                    <button btn-delete-post class="px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-sky-600 block w-full font-medium text-left text-base rounded-md">
                        Delete post
                    </button>
                </div>
            </div>
        `,
        maxWidth: 250,
        placement: 'bottom',
        hideOnClick: false,
        interactive: true,
        arrow: false,
    })
    
    if (authUser.user._id != post.owner._id) {
        $(settingPopper.popper).find('button[btn-delete-post]').remove();
        $(settingPopper.popper).find('button[btn-edit-post]').remove();
    }

    $(settingPopper.popper).find('button[btn-delete-post]').on('click touch', function(e) {
        socket.emit('delete_post', post._id);
    })

    var edit_post =  $(`
        <div class="flex flex-wrap ">
            <div class="flex-1 p-2">
                <input input-edit-${post._id} class="p-2 rounded-md border border-slate-200 w-full focus:border-slate-200" type="text" value ="${post.content}">
            </div>
            <div class="flex items-center flex-wrap space-x-3">
                <button btn-content-edit class="text-slate-400 hover:text-slate-700">
                    <svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512"><path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z"/></svg>
                </button>
                <button btn-content-edit-cancel class="text-slate-400">
                    <svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><polygon points="24 1.414 22.586 0 12 10.586 1.414 0 0 1.414 10.586 12 0 22.586 1.414 24 12 13.414 22.586 24 24 22.586 13.414 12 24 1.414"/></svg>
                </button>
            </div>
        </div>
    `);

    $(settingPopper.popper).find('button[btn-edit-post]').on('click touch', function(e) {
       $('p[content-' + post._id + ']').remove();
       $('div[div-content-' + post._id + ']').append(edit_post);
    })

    edit_post.find('button[btn-content-edit]').on('click touch', function(e) {
        if ($('input[input-edit-' + post._id + ']').val() != '')
            socket.emit('edit_post', post._id, $('input[input-edit-' + post._id + ']').val());
    });
    edit_post.find('button[btn-content-edit-cancel]').on('click touch', function(e) {
        refreshPostList();
    });

    return postDom;
}
