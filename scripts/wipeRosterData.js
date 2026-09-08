require('dotenv').config();
const mongoose = require('mongoose');
const PlayerBirthday = require('../src/models/PlayerBirthday');
const Team = require('../src/models/Team');

async function main() {
    const confirmed = process.argv.includes('--confirm');

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error('MONGODB_URI no está configurada en variables de entorno');
        process.exit(1);
    }

    await mongoose.connect(mongoURI);

    const playerCount = await PlayerBirthday.countDocuments();
    const teamCount = await Team.countDocuments();

    if (!confirmed) {
        console.log(`Se borrarían ${playerCount} jugadores y ${teamCount} equipos.`);
        console.log('Nada fue borrado. Volvé a correr con --confirm para ejecutar el borrado.');
        await mongoose.disconnect();
        return;
    }

    await PlayerBirthday.deleteMany({});
    await Team.deleteMany({});

    console.log(`Borrados ${playerCount} jugadores y ${teamCount} equipos.`);
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error('Error al borrar jugadores y equipos:', error);
    process.exit(1);
});
