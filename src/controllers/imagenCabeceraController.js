const imagenCabeceraService = require('../services/imagenCabeceraManage');

const addImagenCabeceraController = async (req, res) => {
    try {
        const { urlImagen } = req.body;
        const photoBuffer = req.file ? req.file.buffer : null;
        
        const data = await imagenCabeceraService.addImagenCabecera(photoBuffer, urlImagen);
        
        if (data.code === 11001) {
            return res.status(400).json({ message: "Foto no Válida", code: 11001 });
        }
        if (data.code === 11002) {
            return res.status(400).json({ message: "Máximo 4 imágenes permitidas", code: 11002 });
        }
        
        return res.status(201).json(data);
    } catch (error) {
        if (error.code === 11001) {
            return res.status(400).json({ message: "Foto no Válida", code: 11001 });
        }
        if (error.code === 11002) {
            return res.status(400).json({ message: "Máximo 4 imágenes permitidas", code: 11002 });
        }
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

const getImagenesCabeceraController = async (req, res) => {
    try {
        const imagenes = await imagenCabeceraService.getImagenesCabecera();
        return res.status(200).json({
            status: 200,
            message: 'success',
            data: imagenes
        });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

const deleteImagenCabeceraController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await imagenCabeceraService.deleteImagenCabecera(id);
        
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: 'Imagen not found'
            });
        }
        
        return res.status(200).json({
            status: 200,
            message: 'Imagen deleted successfully',
            data: data
        });
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

module.exports = {
    addImagenCabeceraController,
    getImagenesCabeceraController,
    deleteImagenCabeceraController
};