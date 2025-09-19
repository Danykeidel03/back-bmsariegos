const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const createTeamValidators = require('../validations/teamValidator');

router.get('/', teamController.getTeams);
router.post('/', createTeamValidators, teamController.createTeam);
router.put('/:id/name', teamController.updateTeamName);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;