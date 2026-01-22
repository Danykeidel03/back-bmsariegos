const PlayerBirthday = require('../models/PlayerBirthday');
const cloudinary = require('../config/cloudinary');

async function getDates() {
    try {
        const today = new Date();
        const todayMonth = today.getUTCMonth();
        const todayDate = today.getUTCDate();

        const players = await PlayerBirthday.find();

        const playersWithBirthdayToday = players.filter(player => {
            const birthDate = new Date(player.birthDay);
            const birthMonth = birthDate.getUTCMonth();
            const birthDay = birthDate.getUTCDate();
            return birthMonth === todayMonth && birthDay === todayDate;
        });

        if (playersWithBirthdayToday.length > 0) {
            return playersWithBirthdayToday;
        }

        const playersWithDays = players.map(player => {
            const birthDate = new Date(player.birthDay);
            const thisYear = today.getFullYear();
            const nextBirthday = new Date(thisYear, birthDate.getUTCMonth(), birthDate.getUTCDate());

            if (nextBirthday <= today) {
                nextBirthday.setFullYear(thisYear + 1);
            }

            const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

            return {
                ...player.toObject(),
                daysUntil
            };
        });

        const daysArray = playersWithDays.map(p => p.daysUntil);
        const minDays = Math.min(...daysArray);
        const result = playersWithDays.filter(p => p.daysUntil === minDays);
        return result;
    } catch (e) {
        return e
    }
}

async function createBirthday({ name, dni, birthDay, category, photoBuffer }) {
    try {
        if (!photoBuffer) {
            const err = new Error('Photo required');
            err.code = 11001;
            throw err;
        }

        // Subir imagen a Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'birthday',
                    public_id: name.replace(/\s+/g, '_').toLowerCase()
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(photoBuffer);
        });

        const newBirthday = new PlayerBirthday({
            name,
            dni,
            birthDay: new Date(birthDay),
            category,
            photoName: uploadResult.secure_url
        });

        const savedBirthday = await newBirthday.save();
        return savedBirthday;
    } catch (e) {
        return e;
    }
}

async function updatePlayer(id, { name, dni, birthDay, category, photoBuffer }) {
    try {
        const player = await PlayerBirthday.findById(id);
        if (!player) {
            const err = new Error('Player not found');
            err.code = 404;
            throw err;
        }

        const updateData = {
            name: name,
            dni: dni,
            birthDay: new Date(birthDay),
            category: category
        };

        // Si se proporciona una nueva foto, subirla a Cloudinary
        if (photoBuffer) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'birthday',
                        public_id: name.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now()
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(photoBuffer);
            });
            updateData.photoName = uploadResult.secure_url;
        }

        const updatedPlayer = await PlayerBirthday.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        return updatedPlayer;
    } catch (e) {
        return e;
    }
}

async function getAllBirthdays() {
    try {
        const players = await PlayerBirthday.find();
        return players;
    } catch (e) {
        return e;
    }
}

async function deleteBirthday(id) {
    try {
        const player = await PlayerBirthday.findByIdAndDelete(id);
        return player;
    } catch (e) {
        return e;
    }
}

module.exports = { getDates, createBirthday, updatePlayer, getAllBirthdays, deleteBirthday };
