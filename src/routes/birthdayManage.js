const express = require('express');
const router = express.Router();
const multer = require('multer');
const birthdayController = require('../controllers/birthdayController');
const createBirthdayValidators = require('../validations/birthdayValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.get('/', birthdayController.getBirthdays);
router.get('/getAllbirthday', birthdayController.getAllBirthdays);
router.post('/', authMiddleware.verificarToken, upload.single('photo'), createBirthdayValidators, birthdayController.createBirthday);
router.put('/:id', authMiddleware.verificarToken, upload.single('photo'), createBirthdayValidators, birthdayController.updatePlayer);
router.delete('/:id', authMiddleware.verificarToken, birthdayController.deleteBirthday);


module.exports = router;
