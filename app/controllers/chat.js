const Room = require('../models/Room');
const Storage = require('../global/storage');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function index(req, res) {
  res.render('chat');
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function room(req, res) {
  var roomId = req.params.id;
  var room = await Room.find({id: roomId});
  if(!room.length)
    return res.status(404).send('404');
  res.render('room', {roomId: roomId});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function files(req, res) {
  var files = {};
  for(let field in req.files) {
    files[field] = Storage.url(Storage.fromFolder('public/room').upload(req.files[field]));
  }
  res.send(files);
}

module.exports = {
  index,
  room,
  files
};
