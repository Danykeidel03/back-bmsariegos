const express = require('express');
const router = express.Router();
const multer = require('multer');
const rivalTeamController = require('../controllers/rivalTeamController');
const createRivalTeamValidators = require('../validations/rivalTeamValidator');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', rivalTeamController.getRivalTeams);
router.post('/', upload.single('photo'), createRivalTeamValidators, rivalTeamController.createRivalTeam);

module.exports = router;