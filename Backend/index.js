require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors=require('cors')

const app = express();
app.use(express.json());
app.use(cors());

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