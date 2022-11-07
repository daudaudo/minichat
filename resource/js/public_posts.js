const $ = require('./animation');
const dayjs = require('dayjs');

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
            default:
                console.log(evt);
                break;
        }
    },
    post_created: () => {
        $('#contentInput').val('');
    },
    connect: () => {
        $('#postsList').empty();
        socket.emit('get_posts_list');
    }
}

const socket = require('../dependencies/pusher')(callbacks);

$('#createPostBtn').on('click touch', function(e) {
    socket.emit('create_post', {content: $('#contentInput').val()});
});

function renderPost(post) {
    return $(`
        <div class="p-4 shadow-md rounded-md bg-white mb-8">
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
                    <button class="flex items-center">
                        <svg class="w-6 h-6 fill-slate-600 hover:fill-red-400" xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"/></svg>
                    </button>
                    <button class="flex items-center">
                        <svg class="w-6 h-6 fill-slate-600 hover:fill-red-400" xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width="512" height="512"><path d="M16.514,4.213c-1.122-.953-2.282-1.937-3.446-3.1L12,.048,10.941,1.114a14.411,14.411,0,0,0-3.317,6.1c-.015-.052-.029-.1-.043-.157L6.947,4.6,5.1,6.334C3.245,8.073,1.531,10.154,1.53,13.58A10.376,10.376,0,0,0,9.3,23.711a10.984,10.984,0,0,0,2.69.337A10.464,10.464,0,0,0,22.47,13.582C22.47,9.27,19.709,6.926,16.514,4.213Zm.069,15.261c-.109.084-.225.154-.337.232a4.584,4.584,0,0,0,.35-1.753c0-2.539-2.3-3.552-4.6-5.85-2.507,2.507-4.6,3.311-4.6,5.85A4.574,4.574,0,0,0,7.8,19.8,7.469,7.469,0,0,1,4.536,13.58a5.463,5.463,0,0,1,1.137-3.449c.109.172.224.338.346.5a2.253,2.253,0,0,0,2.32.854A2.314,2.314,0,0,0,10.1,9.7a15.809,15.809,0,0,1,2.043-5.316c.844.776,1.67,1.477,2.426,2.12,3.218,2.731,4.9,4.287,4.9,7.078A7.423,7.423,0,0,1,16.583,19.474Z"/></svg>
                    </button>
                </div>
                <div>
                    <button class="text-slate-700">
                        <svg class="w-6 h-6 object-center object-contain" fill="currentColor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="512" height="512">
                            <g>
                                <circle cx="256" cy="53.333" r="53.333"/>
                                <circle cx="256" cy="256" r="53.333"/>
                                <circle cx="256" cy="458.667" r="53.333"/>
                            </g>
                        </svg>                                
                    </button>
                </div>
            </div>
        </div>
    `);
}
