const Match = require('../models/Match');

async function createMatch({ rivalTeam, ownTeam, date, time, location }) {
    try {
        const newMatch = new Match({
            rivalTeam,
            ownTeam,
            date: new Date(date),
            time,
            location
        });
        
        const savedMatch = await newMatch.save();
        return savedMatch;
    } catch (e) {
        return e;
    }
}

async function getMatches() {
    try {
        const matches = await Match.find()
            .populate('rivalTeam', 'name photoName')
            .populate('ownTeam', 'name category division');
        return matches;
    } catch (e) {
        return e;
    }
}

async function updateMatch(id, { result, completed }) {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(
            id,
            { result, completed },
            { new: true }
        ).populate('rivalTeam', 'name photoName')
         .populate('ownTeam', 'name category division');
        return updatedMatch;
    } catch (e) {
        return e;
    }
}

module.exports = { createMatch, getMatches, updateMatch };