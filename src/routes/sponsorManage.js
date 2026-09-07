const express = require('express');
const router = express.Router();
const multer = require('multer');
const sponsorController = require('../controllers/sponsorController');
const createSponsorValidators = require('../validations/sponsorValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

router.get('/', sponsorController.getSponsors);
router.post('/', authMiddleware.verificarToken, upload.single('photo'), createSponsorValidators, sponsorController.createSponsor);

module.exports = router;