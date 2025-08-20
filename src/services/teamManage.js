const Team = require('../models/Team');

async function createTeam({ name, category, division }) {
    try {
        const newTeam = new Team({
            name,
            category,
            division
        });
        
        const savedTeam = await newTeam.save();
        return savedTeam;
    } catch (e) {
        return e;
    }
}

async function getTeams() {
    try {
        const teams = await Team.find();
        return teams;
    } catch (e) {
        return e;
    }
}

module.exports = { createTeam, getTeams };