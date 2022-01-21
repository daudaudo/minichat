var listRooms = {};

const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    console.log(data);
  },
  create_room: (data) => {
    $('#roomsList').append(renderRoomView(data));
  },
  rooms: (data) => {
    var roomIds = Object.keys(data);
    roomIds.forEach(roomId => {
      if(!listRooms[roomId])
        $('#roomsList').append(renderRoomView(data[roomId]));
    });
    listRooms = data;
  }
}

function renderRoomView(room) {
  return `
    <div class="p-4 xl:w-1/3 md:w-1/2 w-full">
      <div class="p-2 bg-slate-100 rounded rounded-br-lg">
        <div class="w-full p-2 font-semibold text-lg text-slate-600 flex space-x-4 items-center mb-4">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-8 h-8" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" />
            </svg>
          </span>
          <div>
            <p class="text-lg">${room['name']}</p>
            <p class="font-medium text-slate-500">${room['level']} - ${room['language'] ?? 'Any'}</p>
          </div>
        </div>
        <div class="flex justify-start flex-wrap mb-2">
          <div class="p-2"><button><img class="rounded-full w-20 h-20 object-cover" src="https://images.pexels.com/photos/10656036/pexels-photo-10656036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" srcset=""></button></div>
          <div class="p-2"><button><img class="rounded-full w-20 h-20 object-cover" src="https://images.pexels.com/photos/10656036/pexels-photo-10656036.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" srcset=""></button></div>
          <div class="p-2"><button class="w-20 h-20 rounded-full border border-slate-500 border-dashed"></button></div>
          <div class="p-2"><button class="w-20 h-20 rounded-full border border-slate-500 border-dashed"></button></div>
        </div>
        <div class="w-full p-2 flex justify-center">
          <button href="/room/232" class="box-border text-white p-1 px-4 hover:bg-white bg-sky-700 hover:text-slate-700 rounded rounded-br-lg border-2 border-sky-700 transition-all flex items-center space-x-2">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="w-6 h-6" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
              <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg></span>
            <a href="/chat/${room['id']}" class="font-medium">Join</a>
          </button>
        </div>
      </div>
    </div>
  `
}

pusher(callbacks);