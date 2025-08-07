const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;