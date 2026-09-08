const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const createTeamValidators = require('../validations/teamValidator');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', teamController.getTeams);
router.post('/', authMiddleware.verificarToken, createTeamValidators, teamController.createTeam);
router.put('/:id/name', authMiddleware.verificarToken, teamController.updateTeamName);
router.put('/:id/details', authMiddleware.verificarToken, teamController.updateTeamDetails);
router.put('/:id/clasificacion-url', authMiddleware.verificarToken, teamController.updateClasificacionUrl);
router.put('/reorder', authMiddleware.verificarToken, teamController.reorderTeams);
router.delete('/:id', authMiddleware.verificarToken, teamController.deleteTeam);

module.exports = router;