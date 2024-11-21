require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { createServer } = require("http");
const { Server } = require("socket.io");
const gameRoutes = require('./routes/gameRoutes');
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
app.use('/api/game', gameRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/user', userRoutes);


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
            socket.leave(roomId);
            console.log(`User ${userId} left room ${roomId}`);
      
            // Remove user from the room in the database
            await removeUserFromRoom(roomId, userId);
      
            io.in(roomId).emit('userLeft', { message: `User ${userId} has left the room`, userId: userId });
          } catch (error) {
            console.error('Error leaving room:', error);
          }
    });
    socket.on('startGame', ({ roomId }) => {
        console.log(`Starting game in room ${roomId}`);
        io.in(roomId).emit('startGame');
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Further logic for user leaving a room can be added here
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