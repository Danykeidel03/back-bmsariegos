const express = require('express');
const router = express.Router();
const multer = require('multer');
const birthdayController = require('../controllers/birthdayController');
const createBirthdayValidators = require('../validations/birthdayValidator');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', birthdayController.getBirthdays);
router.post('/', upload.single('photo'), createBirthdayValidators, birthdayController.createBirthday);

module.exports = router;
