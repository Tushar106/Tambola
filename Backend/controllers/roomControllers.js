const Room = require('../models/room');

const Game = require('../models/game');
const generateUniqueId = require('../utils/generateUniqueId');
const generateTicket = require('../utils/generateTicket')

// create a new room
exports.createRoom = async (req, res, io) => {
    const { userId } = req.body;// user who is creating room
    console.log(userId)
    try {
        const room = new Room({
            status: "waiting",
            players: [userId],
            tickets: [],
            drawnNumbers: [],
            winners: [],
            createdBy: userId
        });
        await room.save();
        console.log(room)

        //  io.emit('roomCreated', { roomId: room.roomId, gameId: game.gameId });
        res.status(200).json(room);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error in creating room: " + error.message)
    }
};


// join a room
exports.joinRoom = async (req, res, io) => {
    const { userId, roomId } = req.body;
    console.log(userId, roomId)

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json("Room not found");
        }

        if (room.status !== 'waiting') {
            return res.status(404).json("Room is not in waiting state");
        }

        room.players.push(userId);
        await room.save();
        console.log(room)
        res.status(200).json(room);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error in joining room: " + error.message);
    }
};

