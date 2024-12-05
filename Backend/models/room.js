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