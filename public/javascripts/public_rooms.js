const callbacks = {
  connection: (data) => {
    console.log(data);
  },
  private: (data) => {
    console.log(data);
  },
  create_room: (data) => {
    console.log(data);
  }
}

pusher(callbacks);