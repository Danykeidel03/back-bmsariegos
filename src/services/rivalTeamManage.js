const RivalTeam = require('../models/RivalTeam');
const cloudinary = require('../config/cloudinary');

async function createRivalTeam({ name, photoBuffer }) {
    try {
        if (!photoBuffer) {
            const err = new Error('Photo required');
            err.code = 11001;
            throw err;
        }

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder: 'rival-teams',
                    public_id: name.replace(/\s+/g, '_').toLowerCase()
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(photoBuffer);
        });

        const newRivalTeam = new RivalTeam({
            name,
            photoName: uploadResult.secure_url
        });
        
        const savedRivalTeam = await newRivalTeam.save();
        return savedRivalTeam;
    } catch (e) {
        return e;
    }
}

async function getRivalTeams() {
    try {
        const rivalTeams = await RivalTeam.find();
        return rivalTeams;
    } catch (e) {
        return e;
    }
}

module.exports = { createRivalTeam, getRivalTeams };