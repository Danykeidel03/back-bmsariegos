const express = require('express');
const router = express.Router();
const multer = require('multer');
const imagenCabeceraController = require('../controllers/imagenCabeceraController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit
    }
});

router.post('/', authMiddleware.verificarToken, upload.single('photo'), imagenCabeceraController.addImagenCabeceraController);
router.get('/', imagenCabeceraController.getImagenesCabeceraController);
router.delete('/:id', authMiddleware.verificarToken, imagenCabeceraController.deleteImagenCabeceraController);

module.exports = router;