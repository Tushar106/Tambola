const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    players:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    status:
    {
        type: String,
        enum: ['waiting', 'started', 'ended'],
        default: 'waiting'
    },
    tickets: [
        {
            playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            ticketNumbers: [[Number]],
            markedNumbers: [Number]
        }],
    drawnNumbers: [Number],
    winners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:
    {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Room", roomSchema);