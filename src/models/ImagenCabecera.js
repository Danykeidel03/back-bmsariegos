const mongoose = require('mongoose');

const imagenCabeceraSchema = new mongoose.Schema({
    imgCabecera: { type: String, required: true },
    urlImagen: { type: String, required: true }
});

const ImagenCabecera = mongoose.model('ImagenCabecera', imagenCabeceraSchema);

module.exports = ImagenCabecera;