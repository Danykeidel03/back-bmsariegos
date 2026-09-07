const express = require('express');
const router = express.Router();
const multer = require('multer');
const noticeController = require('../controllers/noticeController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

router.post('/', authMiddleware.verificarToken, upload.single('photo'), noticeController.newNoticeController);
router.get('/', noticeController.getNoticesController);
router.get('/getAll', noticeController.getAllNoticesController);
router.get('/slug/:slug', noticeController.getNoticeBySlugController);
router.delete('/:id', authMiddleware.verificarToken, noticeController.deleteNotice);

module.exports = router;