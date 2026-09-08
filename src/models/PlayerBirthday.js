const mongoose = require('mongoose');

const playerBirthdaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    birthDay: { type: Date, required: true },
    category: { type: String, required: true },
    photoName: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null }
});

const PlayerBirthday = mongoose.model('PlayerBirthday', playerBirthdaySchema, 'playersBirthday');

module.exports = PlayerBirthday;
