const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    rivalTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'RivalTeam', required: true },
    ownTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    result: { type: String, default: '0-0' },
    completed: { type: Number, default: 0 },
    location: { type: String, required: true },
    isHome: { type: Boolean, required: true }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;