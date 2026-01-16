const express = require('express');
const router = express.Router();
const multer = require('multer');
const sponsorController = require('../controllers/sponsorController');
const createSponsorValidators = require('../validations/sponsorValidator');
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit
    }
});

router.get('/', sponsorController.getSponsors);
router.post('/', upload.single('photo'), createSponsorValidators, sponsorController.createSponsor);

module.exports = router;