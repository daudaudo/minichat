const $ = require('./animation');
const dayjs = require('dayjs');
const maxLengthContent = 300;

const callbacks = {
    connection: (data) => {
        console.log(data);
    },
    public: (evt) => {
        switch (evt.type) {
            case 'post_created':
                $('#postsList').prepend(renderPost(evt.data.post));
                break;
            case 'get_posts_list':
                evt.data.posts?.forEach(post => $('#postsList').append(renderPost(post)))
                break;
            case 'changed_post':
                if (evt.data.post.like[authUser.user._id])
                    $(`#postsList [data-post-id="${evt.data.post._id}"]`).find('button[btn-like-post]').addClass('active');
                else 
                    $(`#postsList [data-post-id="${evt.data.post._id}"]`).find('button[btn-like-post]').removeClass('active');
                $(`#postsList [data-post-id="${evt.data.post._id}"]`).find('p[like-count]').text(Object.keys(evt.data.post.like).length.toString());
                break;
            case 'get_comment_list':
                var Dom = $(`#postsList [data-post-id="${evt.data.post_id}"]`).find('#postComment')
                Dom.empty()
                evt.data.comments.forEach(comment => Dom.append(renderCommentView(comment)));
                break;
            case 'like_comment_socket':
                if(evt.data.comment.like == 1){
                    $(`#postComment [comment-id="${evt.data.comment.comment._id}"]`).find('button[btn-like-comment]').addClass('active');
                } else {
                    $(`#postComment [comment-id="${evt.data.comment.comment._id}"]`).find('button[btn-like-comment]').removeClass('active');
                }
                break;
            case 'created_comment' :
                var Dom = $(`#postsList [data-post-id="${evt.data.comment.post_id}"]`).find('#postComment')
                Dom.prepend(renderCommentView(evt.data.comment))
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
        socket.emit('get_posts_list');
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
    var likeComment = comment.like.includes(authUser.user._id) ? true : false;
    var commentDom = $(`
    <div comment-id="${comment._id}" class="bg-white dark:bg-gray-800 text-black dark:text-gray-200 antialiased flex max-w-lg">
    <img class="rounded-full h-8 w-8 mr-2 mt-1 " src="${comment.user_id.picture}" style="width: 32px; height: 32px;" />
        <div>
            <div class="bg-gray-100 dark:bg-gray-700 px-4 pt-2 pb-2.5 "
                style="background-color: #F1F5F9; border-radius: 20px;">
                <div class="font-bold text-sm leading-relaxed" style="color: #334155;">${comment.user_id.username}</div>
                <span class="text-normal leading-snug md:leading-normal w-fit" style="color: #334155;">${comment.content}</span>
            </div>
            <div class="flex ml-1.5">
                <button btn-like-comment class="flex items-center ${likeComment != true ? "" : "active"}">
                    <p like class="text-sm  ml-4 font-semibold ${likeComment != true ? "" : "active"}">Like</p>
                </button>
                <div class="text-xs ml-3 mt-0.5 text-gray-500 dark:text-gray-400" style="color: #4F4F4F;">${dayjs(comment.created_at).format('DD-MM')}</div>
            </div>
        </div>
    </div>
    `);

   commentDom.find('button[btn-like-comment]').on('click touch', function(e) {
    socket.emit('like_comment', comment._id);
   });

   return commentDom;
}

$('#createCommentBtn').on('click touch', function(e) {
    e.preventDefault();
    
    var content = $('#commentInput').val();
    socket.emit('create_comment', {
      content : content,
    //   post_id : ObjectId
    });
  });

function renderPost(post) {
    var likedPost = post.like[authUser.user._id] ? true : false;
    var postDom = $(`
        <div data-post-id="${post._id}" class="p-4 shadow-md rounded-md bg-white mb-8">
            <div class="flex items-center space-x-2 mb-4">
                <div><img src="${post.owner.picture}" class="w-12 h-12 object-cover rounded-full" alt="" srcset=""></div>
                <div class="">
                    <p class="text-slate-500 text-sm font-semibold">${post.owner.username}</p>
                    <p class="text-slate-400 font-medium text-xs">${dayjs(post.created_at).format('DD-MM-YYYY HH:mm:ss')}</p>
                </div>
            </div>
            <p class="text-slate-500 font-medium text-base pb-3 border-b border-slate-300">${post.content}</p>
            <div class="flex items-center justify-between mt-3">
                <div class="flex space-x-3">
                    <button btn-like-post class="flex items-center ${likedPost ? "active" : ""}">
                        <p like-count class="text-sm text-slate-700 ml-2 font-semibold">${Object.keys(post.like).length}</p>
                    </button>
                    <button class="flex items-center text-slate-600 hover:text-red-400">
                        <svg fill="currentColor" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512"><path d="M16.514,4.213c-1.122-.953-2.282-1.937-3.446-3.1L12,.048,10.941,1.114a14.411,14.411,0,0,0-3.317,6.1c-.015-.052-.029-.1-.043-.157L6.947,4.6,5.1,6.334C3.245,8.073,1.531,10.154,1.53,13.58A10.376,10.376,0,0,0,9.3,23.711a10.984,10.984,0,0,0,2.69.337A10.464,10.464,0,0,0,22.47,13.582C22.47,9.27,19.709,6.926,16.514,4.213Zm.069,15.261c-.109.084-.225.154-.337.232a4.584,4.584,0,0,0,.35-1.753c0-2.539-2.3-3.552-4.6-5.85-2.507,2.507-4.6,3.311-4.6,5.85A4.574,4.574,0,0,0,7.8,19.8,7.469,7.469,0,0,1,4.536,13.58a5.463,5.463,0,0,1,1.137-3.449c.109.172.224.338.346.5a2.253,2.253,0,0,0,2.32.854A2.314,2.314,0,0,0,10.1,9.7a15.809,15.809,0,0,1,2.043-5.316c.844.776,1.67,1.477,2.426,2.12,3.218,2.731,4.9,4.287,4.9,7.078A7.423,7.423,0,0,1,16.583,19.474Z"/></svg>
                    </button>
                    <button class="flex items-center text-slate-600 hover:text-red-400" btn-comment-post>
                        <svg  fill="currentColor" class="w-6 h-6" viewBox="0 0 30 30" width="512" height="512"><path d="M27.184,1.605H2.156C0.967,1.605,0,2.572,0,3.76v17.572c0,1.188,0.967,2.155,2.156,2.155h13.543
                        l5.057,3.777c0.414,0.31,0.842,0.468,1.268,0.468c0.789,0,1.639-0.602,1.637-1.923v-2.322h3.523c1.188,0,2.154-0.967,2.154-2.155
                        V3.76C29.338,2.572,28.371,1.605,27.184,1.605z M27.34,21.332c0,0.085-0.068,0.155-0.154,0.155h-5.523v3.955l-5.297-3.956H2.156
                        c-0.086,0-0.154-0.07-0.154-0.155V3.759c0-0.085,0.068-0.155,0.154-0.155v0.001h25.029c0.086,0,0.154,0.07,0.154,0.155
                        L27.34,21.332L27.34,21.332z M5.505,10.792h4.334v4.333H5.505C5.505,15.125,5.505,10.792,5.505,10.792z M12.505,10.792h4.334v4.333
                        h-4.334V10.792z M19.505,10.792h4.334v4.333h-4.334V10.792z"/> </svg>
                    </button>
                </div>
                <div>
                    <button class="text-slate-700">
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
            <div class="bg-white dark:bg-gray-800 text-black dark:text-gray-200 p-4 antialiased max-full flex" >
                <img class="rounded-full h-8 w-8 mr-2 mt-1 " src="${authUser.user.picture}" />
                <span contenteditable="true" commentInput class="text-normal leading-snug md:leading-normal bg-gray-100  dark:bg-gray-700 w-full pt-2 pb-2.5 px-4 inputComment"
                        style="color: #334155;background-color: #F1F5F9;max-width:95%;border-radius: 20px;"></span>
            </div>
           
            <div id="postComment" data-post-id="${post._id}" class="px-4 space-y-4 pt-2">
            </div>
            <button btn-get-comment>
                <p class="text-slate-500 font-medium text-base">Xem binh luan</p>
            </button>
        </div>
    `);

    postDom.find('button[btn-like-post]').on('click touch', function(e) {
        socket.emit('like_post', post._id);
    });

    postDom.find('button[btn-get-comment]').on('click touch', function(e) {
        postDom.find('#postComment').empty()
        socket.emit('get_comment_list', post._id);
    });

    var commentInput = postDom.find('span[commentInput]')

    commentInput.on('keypress', function(e) {
        var content = commentInput.text().trim()
        if(e.key == 'Enter'){
            if(content.length){
                e.preventDefault()
                var data = {content : content, post_id: post._id}
                commentInput.text('')
                socket.emit('create_comment', data);    
            }
        }         
    });

    return postDom;
}
