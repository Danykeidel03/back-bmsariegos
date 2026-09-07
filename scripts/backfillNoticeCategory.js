// Backfill de `category` para noticias creadas antes de que el campo existiera.
// Todas las noticias previas se consideran "general".
// Uso: node scripts/backfillNoticeCategory.js
require('dotenv').config();
const mongoose = require('mongoose');
const Notice = require('../src/models/Notice');

async function run() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error('MONGODB_URI no está configurada en variables de entorno');
    }
    await mongoose.connect(mongoURI);

    const result = await Notice.updateMany(
        { $or: [{ category: { $exists: false } }, { category: null }] },
        { $set: { category: 'general' } }
    );
    console.log(`Noticias actualizadas: ${result.modifiedCount}`);

    await mongoose.disconnect();
    console.log('Listo.');
}

run().catch((e) => {
    console.error('Error en backfill:', e);
    process.exit(1);
});
