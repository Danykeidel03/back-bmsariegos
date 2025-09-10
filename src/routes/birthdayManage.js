const express = require('express');
const router = express.Router();
const multer = require('multer');
const birthdayController = require('../controllers/birthdayController');
const createBirthdayValidators = require('../validations/birthdayValidator');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', birthdayController.getBirthdays);
router.get('/getAllbirthday', birthdayController.getAllBirthdays);
router.post('/', upload.single('photo'), createBirthdayValidators, birthdayController.createBirthday);
router.put('/:id', createBirthdayValidators, birthdayController.updatePlayer);
router.delete('/:id', birthdayController.deleteBirthday);


module.exports = router;
