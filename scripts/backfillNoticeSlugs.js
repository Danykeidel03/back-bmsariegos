// Backfill de `slug` para noticias creadas antes de que el campo existiera.
// Uso: node scripts/backfillNoticeSlugs.js
require('dotenv').config();
const mongoose = require('mongoose');
const Notice = require('../src/models/Notice');
const { slugify } = require('../src/services/noticeManage');

async function run() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error('MONGODB_URI no está configurada en variables de entorno');
    }
    await mongoose.connect(mongoURI);

    const notices = await Notice.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] });
    console.log(`Noticias sin slug: ${notices.length}`);

    for (const notice of notices) {
        let slug = slugify(notice.title);
        let suffix = 1;
        while (await Notice.exists({ slug, _id: { $ne: notice._id } })) {
            suffix += 1;
            slug = `${slugify(notice.title)}-${suffix}`;
        }
        notice.slug = slug;
        await notice.save();
        console.log(`✅ "${notice.title}" -> ${slug}`);
    }

    await mongoose.disconnect();
    console.log('Listo.');
}

run().catch((e) => {
    console.error('Error en backfill:', e);
    process.exit(1);
});
