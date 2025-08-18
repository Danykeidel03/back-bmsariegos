const Sponsor = require('../models/Sponsor');
const cloudinary = require('../config/cloudinary');

async function createSponsor({ name, photoBuffer }) {
    try {
        if (!photoBuffer) {
            const err = new Error('Photo required');
            err.code = 11001;
            throw err;
        }

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { 
                    folder: 'patrocinadores',
                    public_id: name.replace(/\s+/g, '_').toLowerCase()
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(photoBuffer);
        });

        const newSponsor = new Sponsor({
            name,
            photoName: uploadResult.secure_url
        });
        
        const savedSponsor = await newSponsor.save();
        return savedSponsor;
    } catch (e) {
        return e;
    }
}

async function getSponsors() {
    try {
        const sponsors = await Sponsor.find();
        return sponsors;
    } catch (e) {
        return e;
    }
}

module.exports = { createSponsor, getSponsors };