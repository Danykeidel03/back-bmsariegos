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
        const teams = await Team.find().sort({ order: 1 });
        return teams;
    } catch (e) {
        return e;
    }
}

async function deleteTeam(id) {
    try {
        const deletedTeam = await Team.findByIdAndDelete(id);
        return deletedTeam;
    } catch (e) {
        return e;
    }
}

async function updateTeamName(id, { name }) {
    try {
        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );
        return updatedTeam;
    } catch (e) {
        return e;
    }
}

async function reorderTeams(teamOrders) {
    try {
        const updatePromises = teamOrders.map(({ id, order }) => 
            Team.findByIdAndUpdate(id, { order }, { new: true })
        );
        const updatedTeams = await Promise.all(updatePromises);
        return updatedTeams;
    } catch (e) {
        return e;
    }
}

module.exports = { createTeam, getTeams, deleteTeam, updateTeamName, reorderTeams };