require('dotenv').config();
const mongoose = require('mongoose');
const Match = require('../src/models/Match');

async function main() {
    const confirmed = process.argv.includes('--confirm');

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error('MONGODB_URI no está configurada en variables de entorno');
        process.exit(1);
    }

    await mongoose.connect(mongoURI);

    const matchCount = await Match.countDocuments();

    if (!confirmed) {
        console.log(`Se borrarían ${matchCount} partidos.`);
        console.log('Nada fue borrado. Volvé a correr con --confirm para ejecutar el borrado.');
        await mongoose.disconnect();
        return;
    }

    await Match.deleteMany({});

    console.log(`Borrados ${matchCount} partidos.`);
    await mongoose.disconnect();
}

main().catch((error) => {
    console.error('Error al borrar partidos:', error);
    process.exit(1);
});
