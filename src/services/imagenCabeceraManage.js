const ImagenCabecera = require('../models/ImagenCabecera');
const cloudinary = require('../config/cloudinary');

const addImagenCabecera = async (photoBuffer, urlImagen) => {
    const count = await ImagenCabecera.countDocuments();
    if (count >= 4) {
        const err = new Error('Máximo 4 imágenes de cabecera permitidas');
        err.code = 11002;
        throw err;
    }
    
    if (!photoBuffer) {
        const err = new Error('Photo required');
        err.code = 11001;
        throw err;
    }

    const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { 
                folder: 'imagenes-cabecera',
                public_id: `cabecera_${Date.now()}`,
                transformation: [
                    { width: 2000, height: 700, crop: 'fill', gravity: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(photoBuffer);
    });

    const nuevaImagen = new ImagenCabecera({ 
        imgCabecera: uploadResult.secure_url, 
        urlImagen 
    });
    return await nuevaImagen.save();
};

const getImagenesCabecera = async () => {
    return await ImagenCabecera.find();
};

const deleteImagenCabecera = async (id) => {
    return await ImagenCabecera.findByIdAndDelete(id);
};

module.exports = {
    addImagenCabecera,
    getImagenesCabecera,
    deleteImagenCabecera
};