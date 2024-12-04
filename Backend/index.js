require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/userRoutes');
const { removeUserFromRoom } = require('./controllers/roomControllers');


const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    req.io = io;
    next();
});


// Routes
app.use('/api/room', roomRoutes);
app.use('/api/user', userRoutes);

// Function to generate a random number
const generateRandomNumber = (drawnNumbers) => {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
    } while (drawnNumbers.has(randomNumber));
    return randomNumber;
};

// Worker function to send a random number to each user in the room every 3 seconds
const startNumberBroadcast = (roomId) => {
    const drawnNumbers = new Set();
    const intervalId = setInterval(() => {
        const randomNumber = generateRandomNumber(drawnNumbers);
        drawnNumbers.add(randomNumber);
        console.log(`Sending random number ${randomNumber} to room ${roomId}`);
        io.in(roomId).emit('drawnNumber', { number: randomNumber });
    }, 3000);

    return { intervalId, drawnNumbers };
};
// Store interval IDs for each room
const roomIntervals = {};


// socket.IO events
io.on('connection', (socket) => {
    console.log('user connected: ', socket.id);
    socket.on('newRoom', ({ roomId, userId }) => {
        try {
            console.log(roomId, userId)
            socket.join(roomId);
            console.log(`User ${userId} created room ${roomId}`);
            io.in(roomId).emit('userJoined', { message: `User ${userId} has joined the room`, userId: userId });
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });
    socket.on('joinRoom', ({ roomId, userId }) => {
        try {
            console.log(roomId, userId)
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
            io.in(roomId).emit('userJoined', { message: `User ${userId} has joined the room`, userId: userId });
        } catch (error) {
            console.error('Error joining room:', error);
        }
    });
    socket.on('leaveRoom', async ({ roomId, userId }) => {
        try {
            console.log(`User ${userId} left room ${roomId}`);
            // Remove user from the room in the database
            await removeUserFromRoom(roomId, userId);
            socket.leave(roomId);
            io.in(roomId).emit('userLeft', { message: `User ${userId} has left the room`, userId: userId });
            if (!io.sockets.adapter.rooms.get(roomId) || io.sockets.adapter.rooms.get(roomId)?.size === 0) {
                console.log(io.sockets.adapter.rooms)
                console.log("heh")
                clearInterval(roomIntervals[roomId]?.intervalId);
                delete roomIntervals[roomId];
            }
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    });
    socket.on('startGame', ({ roomId, players }) => {
        console.log(`Starting game in room ${roomId}`);
        io.in(roomId).emit('startGame', { players: players });
        // Start broadcasting random numbers to the room
        if (!roomIntervals[roomId]) {
            console.log(roomIntervals)
            roomIntervals[roomId] = startNumberBroadcast(roomId);
        }
    });
    socket.on('ClaimReward', ({ roomId, userId }) => {
        console.log(`User ${userId} claiming Reward in room ${roomId}`);
        socket.emit("ClaimReward", { revealedNumbers: [...roomIntervals[roomId]?.drawnNumbers] });
    });
    socket.on('rowClaimed', ({ roomId, rowIndex, userId }) => {
        console.log(`Row ${rowIndex} claimed by user ${userId} in room ${roomId}`);
        io.in(roomId).emit('rowClaimed', { rowIndex, userId });
    });
    socket.on('endGame', ({ roomId, winnerId }) => {
        console.log(`Game ended. Winner: ${winnerId} in room ${roomId}`);
        io.in(roomId).emit('endGame', { winnerId });
        // Clear the interval and delete the entry from roomIntervals
        if (roomIntervals[roomId]) {
            clearInterval(roomIntervals[roomId].intervalId);
            delete roomIntervals[roomId];
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Further logic for user leaving a room can be added here
        console.log(io.sockets.adapter.rooms)
        for (const roomId of socket.rooms) {
            if (roomId !== socket.id) {
                if (io.sockets.adapter.rooms.get(roomId)?.size === 0) {
                    clearInterval(roomIntervals[roomId].intervalId);
                    delete roomIntervals[roomId];
                }
            }
        }
    });
});
const connect = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect('mongodb://localhost:27017/tambola')
        console.log('Connected to database');
    } catch (error) {
        throw error;
    }
}
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected');
})
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
})
mongoose.connection.on('error', (error) => {
    console.log('Mongoose connection error', error);
})
app.get("/", (req, res) => {
    console.log("Server Working")
    res.json("Server Working")
})

httpServer.listen(8800, () => {
    connect();
    console.log('Server is running on port 8800');
})