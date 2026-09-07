const mongose = require('mongoose');

const noticeSchema = new mongose.Schema({
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, sparse: true },
    photoName: { type: String, required: true },
    descripcion: { type: String, required: true },
    category: { type: String, enum: ['general', 'deportiva'], default: 'general', required: true },
});

const NoticeRegister = mongose.model('NoticeRegister', noticeSchema);

module.exports = NoticeRegister;