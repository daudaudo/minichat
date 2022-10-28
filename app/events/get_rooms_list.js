const Server = require("socket.io").Server;
const Socket = require("socket.io").Socket;
const Room = require('../models/Room');
const User = require('../models/User');
/**
 * 
 * @param {Server} io 
 * @param {Socket} socket 
 */
function handle(io, socket) {
    return async (filters) => {
        var filters = filters ?? {};
        var rooms = await Room.find({
            "$or": [
                { name: new RegExp(filters.searchText ?? '') },
                { language: new RegExp(filters.searchText ?? '') },
                { level: new RegExp(filters.searchText ?? '') },
            ] 
        })
        .populate('primary_user');

        socket.emit('public', {
            type: 'rooms',
            data: {
                rooms: rooms,
            }
        });
    }
}

module.exports = handle;
