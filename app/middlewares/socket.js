const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
var cookieParser = require('cookie-parser');
var redisStore = require('../global/redis').store;
/**
 * 
 * @param {Socket} socket 
 * @param {VoidFunction} next 
 */
async function handle(socket, next) {
  var promiseResolveUser = new Promise((resolve, rejects) => {
    cookieParser('minichat')(socket.handshake, null, () => {
      redisStore.get(socket.handshake.signedCookies['connect.sid'], (err, session) => {
        if(err) rejects(err);
        resolve(session.auth);
      });
    });
  });

  socket.auth = await promiseResolveUser;
  socket.auth.user.socket_id = socket.id;
  socket.auth.user.streams = {};
  next();
}

module.exports = handle;