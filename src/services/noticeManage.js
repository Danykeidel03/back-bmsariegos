const Notice = require('../models/Notice');
const cloudinary = require('../config/cloudinary');

function slugify(title) {
    return title
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function newNotice(title, photoBuffer, descripcion) {
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
                    folder: 'notice',
                    public_id: title.replace(/\s+/g, '_').toLowerCase()
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(photoBuffer);
        });

        console.log('URL de Cloudinary:', uploadResult.secure_url)

        const notice = new Notice({
            title,
            slug: slugify(title),
            photoName: uploadResult.secure_url,
            descripcion
        });

        console.log('Datos a guardar:', { title, photoName: uploadResult.secure_url, descripcion });
        
        const res = await notice.save();
        console.log('Noticia guardada:', res);
        return res;
    } catch (e) {
        console.log('Error en newNotice:', e);
        return e;
    }
}

async function getLatestNotices() {
    try {
        const notices = await Notice.find()
            .sort({ _id: -1 })
            .limit(3);
        return notices;
    } catch (e) {
        console.log('Error en getLatestNotices:', e);
        return e;
    }
}

async function getNotices() {
    try {
        const notices = await Notice.find()
        return notices;
    } catch (e) {
        console.log('Error en getLatestNotices:', e);
        return e;
    }
}

async function getNoticeBySlug(slug) {
    try {
        const notice = await Notice.findOne({ slug });
        return notice;
    } catch (e) {
        console.log('Error en getNoticeBySlug:', e);
        return e;
    }
}

async function deleteNotice(id) {
    try {
        const deletedNotice = await Notice.findByIdAndDelete(id);
        return deletedNotice;
    } catch (e) {
        return e;
    }
}

module.exports = { newNotice, getLatestNotices, getNotices, getNoticeBySlug, deleteNotice, slugify };