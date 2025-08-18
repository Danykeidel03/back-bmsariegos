const express = require('express');
const router = express.Router();
const multer = require('multer');
const sponsorController = require('../controllers/sponsorController');
const createSponsorValidators = require('../validations/sponsorValidator');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', sponsorController.getSponsors);
router.post('/', upload.single('photo'), createSponsorValidators, sponsorController.createSponsor);

module.exports = router;