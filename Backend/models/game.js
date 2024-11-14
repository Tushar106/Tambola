const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema(
    {
        gameId:
        {
            type: String,
            require: true
        },
        status:
        {
            type: String,
            enum: ['waiting', 'started', 'ended'],
            default: 'waiting'
        },
        players: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        tickets: [
            {
                playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                ticketNumbers: [[Number]],
                markedNumbers: [Number]
            }],
        drawnNumbers:[Number],
        winners:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        currentTurn: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
         createdAt:{type:Date,default:Date.now}
    }
);

module.exports = mongoose.model("Game", gameSchema)