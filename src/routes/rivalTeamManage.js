const express = require('express');
const router = express.Router();
const multer = require('multer');
const rivalTeamController = require('../controllers/rivalTeamController');
const createRivalTeamValidators = require('../validations/rivalTeamValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

router.get('/', rivalTeamController.getRivalTeams);
router.post('/', authMiddleware.verificarToken, upload.single('photo'), createRivalTeamValidators, rivalTeamController.createRivalTeam);

module.exports = router;