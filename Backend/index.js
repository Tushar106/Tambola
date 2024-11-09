require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')
const http = require('http');
const socketIo = require('socket.io');

const gameRoutes=require('./routes/gameRoutes');
const roomRoutes=require('./routes/roomRoutes');
const userRoutes=require('./routes/userRoutes');


const app = express();
const server=http.createServer(app);
 global.io=socketIo(server,{cors:{origin:'*'}});

app.use(express.json());
app.use(cors());



// Routes
app.use('/api/game',gameRoutes);
app.use('/api/room',roomRoutes);
app.use('/api/user',userRoutes);


// socket.IO events
global.io.on('connection',(socket)=>
{
    console.log('user connected: ',socket.id);

    socket.on('joinRoom',({roomId,userId})=>
    {
        try {
            socket.join(roomId);
            io.to(roomId).emit('userJoined', { message: `User ${userId} has joined the room` });
        } catch (error) {
            console.error('Error joining room:', error);
        }
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
    res.send("Server Working")
})

app.listen(8800, () => {
    connect();
    console.log('Server is running on port 8800');
})