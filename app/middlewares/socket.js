const Socket = require("socket.io").Socket;
var cookieParser = require('cookie-parser');
var redisStore = require('../global/redis').store;
var uuid = require('uuid');
/**
 * 
 * @param {Socket} socket 
 * @param {VoidFunction} next 
 */
async function handle(socket, next) {
  var promiseResolveUser = new Promise((resolve, rejects) => {
    cookieParser(process.env.SESSION_SECRET)(socket.handshake, null, () => {
      redisStore.get(socket.handshake.signedCookies['connect.sid'], (err, session) => {
        if(err) rejects(err);
        if (session)
          resolve(session.auth);
        else 
          resolve({
            token: uuid.v4(),
            user: {
              username: 'Guest',
              email: null,
              role: 'guest',
            },
            auth: false,
          });
      });
    });
  });

  socket.auth = await promiseResolveUser;
  socket.auth.user.socket_id = socket.id;
  socket.auth.user.streams = {};
  next();
}

module.exports = handle;
