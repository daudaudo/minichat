const Room = require('../models/Room');
const Storage = require('../global/storage');
const mime = require('mime-types');
const filesize = require('filesize');

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
  var room = await Room.findById(roomId);
  if(!room)
    return res.status(404).send('404');
  res.render('room', {room: room});
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

async function files(req, res) {
  var files = {};
  for(let field in req.files) {
    files[field] = {
      url: Storage.url(Storage.fromFolder('public/room').upload(req.files[field])),
      name: req.files[field].name,
      ext: mime.extension(req.files[field].type),
      type: req.files[field].type,
      size: filesize(req.files[field].size)
    };
  }
  res.send(files);
}

module.exports = {
  index,
  room,
  files
};
