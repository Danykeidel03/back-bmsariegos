const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoName: { type: String, required: true }
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;