const $ = require('./animation');
import tippy from 'tippy.js';
import dayjs from 'dayjs';

const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    console.log(data);
  },
  public: (evt) => {
    switch (evt.type) {
      case 'create_room':
        $('#roomsList').append(renderRoomView(evt.data));
        console.log(evt.data);
        break;
      case 'join_room':
        var user = evt.data.user;
        $(`[room][room-id="${evt.data.roomId}"]`).find('[room-users]').append(renderUserHtml(user));
        break;
      case 'leave_room':
        $(`[room][room-id="${evt.data.roomId}"]`).find(`[socket-id="${evt.data.user.socket_id}"]`).remove();
        break;
      case 'delete_room':
        $(`[room][room-id="${evt.data.id}"]`).remove();
        break;
      case 'rooms':
        evt.data.rooms.forEach(room => $('#roomsList').append(renderRoomView(room)));
        break;
      default:
        console.log(evt);
        break;
    }
  },
  connect: () => {
    refreshRoomList();
    socket.emit('get_rooms_list');
  }
}

function renderRoomView(room) {
  var roomEl = $(`
    <div room room-id="${room._id}" class="p-4 xl:w-1/3 md:w-1/2 w-full h-fit">
      <div class="p-2 bg-slate-100 rounded rounded-br-lg">
        <div class="w-full p-2 font-semibold text-lg text-slate-600 flex space-x-4 items-center mb-4">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-8 h-8" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" />
            </svg>
          </span>
          <div class="w-0 flex-auto">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg">${room['name']}</p>
                <p class="font-medium text-slate-500">${room['language'] ?? 'Any'} - ${room['level'] ?? 'Any'}</p>
              </div>
              <button setting-room><svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="512" height="512" class="w-6 h-6" fill='currentColor'><path d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z"/><path d="M21.294,13.9l-.444-.256a9.1,9.1,0,0,0,0-3.29l.444-.256a3,3,0,1,0-3-5.2l-.445.257A8.977,8.977,0,0,0,15,3.513V3A3,3,0,0,0,9,3v.513A8.977,8.977,0,0,0,6.152,5.159L5.705,4.9a3,3,0,0,0-3,5.2l.444.256a9.1,9.1,0,0,0,0,3.29l-.444.256a3,3,0,1,0,3,5.2l.445-.257A8.977,8.977,0,0,0,9,20.487V21a3,3,0,0,0,6,0v-.513a8.977,8.977,0,0,0,2.848-1.646l.447.258a3,3,0,0,0,3-5.2Zm-2.548-3.776a7.048,7.048,0,0,1,0,3.75,1,1,0,0,0,.464,1.133l1.084.626a1,1,0,0,1-1,1.733l-1.086-.628a1,1,0,0,0-1.215.165,6.984,6.984,0,0,1-3.243,1.875,1,1,0,0,0-.751.969V21a1,1,0,0,1-2,0V19.748a1,1,0,0,0-.751-.969A6.984,6.984,0,0,1,7.006,16.9a1,1,0,0,0-1.215-.165l-1.084.627a1,1,0,1,1-1-1.732l1.084-.626a1,1,0,0,0,.464-1.133,7.048,7.048,0,0,1,0-3.75A1,1,0,0,0,4.79,8.992L3.706,8.366a1,1,0,0,1,1-1.733l1.086.628A1,1,0,0,0,7.006,7.1a6.984,6.984,0,0,1,3.243-1.875A1,1,0,0,0,11,4.252V3a1,1,0,0,1,2,0V4.252a1,1,0,0,0,.751.969A6.984,6.984,0,0,1,16.994,7.1a1,1,0,0,0,1.215.165l1.084-.627a1,1,0,1,1,1,1.732l-1.084.626A1,1,0,0,0,18.746,10.125Z"/></svg></button>
            </div>
          </div>
        </div>
        <div room-users class="flex justify-start flex-wrap mb-2">${renderUsers(room)}</div>
        <div class="w-full p-2 flex justify-center">
          <a href="/room/${room._id}" target="_blank" class="box-border text-white p-1 px-4 hover:bg-white bg-sky-700 hover:text-slate-700 rounded rounded-br-lg border-2 border-sky-700 transition-all flex items-center space-x-2">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
              <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg></span>
            <span class="font-medium">Join</a>
          </a>
        </div>
      </div>
    </div>
  `);

  var settingPopper = tippy(roomEl.find('button[setting-room]')[0], {
    allowHTML: true,
    trigger: 'mouseenter',
    content: `
      <div class="flex flex-col items-center p-2">
        <p class="text-slate-700 font-semibold mb-2">Room Ownner</p>
        <img src="${room.primary_user.picture}" class="w-10 h-10 rounded-full object-cover mb-2">
        <p class="text-slate-700 text-xs font-semibold mb-3">${room.primary_user.username}</p>
        <button btn-delete-room class="w-100 flex items-center space-x-2 p-2 mb-2 rounded-md -mx-2 bg-red-500 hover:bg-transparent border-2 border-transparent hover:border-red-500 hover:text-slate-700 group">
          <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" class="w-4 h-4 fill-gray-100 group-hover:fill-slate-700" width="512" height="512"><path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"/><path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"/><path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/></svg>
          <p class="text-gray-100 text-xs font-medium group-hover:text-slate-700">Delete room</p>
        </button>
        <p class="text-slate-700 text-xs font-semibold mb-1">Created at</p>
        <p class="text-slate-700 text-xs font-semibold mb-1">${dayjs(room.created_at).format('D/M/YY h:m')}</p>
      </div>
    `,
    maxWidth: 250,
    placement: 'bottom',
    hideOnClick: false,
    interactive: true,
    arrow: false,
  })

  if (authUser.user._id != room.primary_user._id) {
    $(settingPopper.popper).find('button[btn-delete-room]').remove();
  }

  $(settingPopper.popper).find('button[btn-delete-room]').on('click touch', function(e) {
    socket.emit('delete_room', room._id);
  })

  return roomEl;
}

function renderUsers(room) {
  var html = '';
  Object.keys(room.users).forEach(userId => {
    var user = room.users[userId];
    html += renderUserHtml(user);
  });

  return html;
}

function renderUserHtml(user) {
  var html = '';
  if (user.role == 'guest')
    html += `<div socket-id="${user.socket_id}" class="p-2"><button class="w-20 h-20 rounded-full border border-slate-500 border-dashed flex justify-center items-center font-medium">Guest ?</button></div>`;
  else
    html += `
    <div socket-id="${user.socket_id}" class="p-2">
      <a href="/wall/${user._id}" class="block">
        <img class="rounded-full w-20 h-20 object-cover" src="${user.picture}" alt="" srcset="">
      </a>
      <div class="flex flex-wrap justify-center space-x-1">
        <div class="">
          <svg class="w-4 h-4 fill-red-400" xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width="512" height="512"><path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"/></svg>
        </div>
        <p class="font-medium text-slate-700 text-sm">${Object.keys(user.like).length}</p>
      </div>
    </div>`;

  return html;
}

const socket = require('../dependencies/pusher')(callbacks);

$('#createRoomBtn').on('click touch', function(e) {
  e.preventDefault();
  var topic = $('#topicTextInput').val();
  var language = $('#languageSelectInput').val();
  var maximumPeople = $('#maximumPeopleSelectInput').val();
  var level = $('#levelSelectInput').val();
  var password = $('#passwordTextInput').val();
  socket.emit('create_room', {
    name: topic,
    language: language,
    maximum_people: maximumPeople,
    level: level,
    password: password,
  });
  $('#createRoomModal').closeModal();
});

var timeoutSearchInput = null;
$('#searchRoomInput').on('input', function(e) {
  clearTimeout(timeoutSearchInput);
  timeoutSearchInput = setTimeout(() => {
    var searchText = $('#searchRoomInput').val();
    refreshRoomList();
    socket.emit('get_rooms_list', {searchText: searchText});
  }, 1200)
})

function refreshRoomList() {
  $('#roomsList [room][room-id]').remove();
}

module.exports = $;
