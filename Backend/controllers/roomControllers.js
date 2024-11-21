const Room = require('../models/room');
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
        res.status(200).json(room);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error in creating room: " + error.message)
    }
};


// join a room
exports.joinRoom = async (req, res, io) => {
    const { userId, roomId } = req.body;
    console.log("hhh", userId, roomId)
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json("Room not found");
        }
        if (room.status !== 'waiting') {
            return res.status(404).json("Room is not in waiting state");
        }
        if (room.players.includes(userId)) {
            return res.status(400).json(room);
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

exports.startRoom = async (req, res, io) => {
    const {  roomId } = req.body;
    console.log(roomId)
    try {
        const room = await Room.findById(roomId).populate('players');
        if (!room) {
            return res.status(404).json("Room not found");
        }
        if (room.status !== 'waiting') {
            return res.status(404).json("Room is not in waiting state");
        }
        room.gameStatus = 'started';
        await room.save();
        res.status(200).json(room);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error in starting room: " + error.message);
    }
};

exports.fetchRoom = async (req, res, io) => {
    const {  roomId } = req.body;
    console.log(roomId)
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json("Room not found");
        }
        if (room.status !== 'waiting') {
            return res.status(404).json("Room is not in waiting state");
        }
        res.status(200).json(room);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error in fetching room: " + error.message);
    }
};
exports.removeUserFromRoom = async (roomId, userId) => {
    try {
        const room = await Room.findById(roomId);
        if (!room) {
            console.error(`Room ${roomId} not found`);
            return;
        }
        console.log(room.users)

        room.players = room.players.filter(players => players.toString() !== userId);
        await room.save();
        console.log(`User ${userId} removed from room ${roomId}`);
    } catch (error) {
        console.error('Error removing user from room:', error);
    }
};



