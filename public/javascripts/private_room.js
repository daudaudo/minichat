var listRooms = {};

const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    console.log(data);
  },
  create_room: (data) => {
    console.log(data);
  },
  rooms: (data) => {
    console.log(data);
  },
  join_room: (user) => {
    console.log(user);
  }
}

const socket = pusher(callbacks);