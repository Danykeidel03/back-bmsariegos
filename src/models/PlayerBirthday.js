const mongoose = require('mongoose');

const playerBirthdaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    dni: { type: String, required: true },
    birthDay: { type: Date, required: true },
    category: { type: String, required: true },
    photoName: { type: String, required: true }
});

const PlayerBirthday = mongoose.model('PlayerBirthday', playerBirthdaySchema, 'playersBirthday');

module.exports = PlayerBirthday;
