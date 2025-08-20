const mongoose = require('mongoose');

const rivalTeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoName: { type: String, required: true }
});

const RivalTeam = mongoose.model('RivalTeam', rivalTeamSchema);

module.exports = RivalTeam;