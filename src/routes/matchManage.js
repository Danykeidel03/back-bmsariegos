const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { createMatchValidators, updateMatchValidators, updateMatchDateTimeValidators } = require('../validations/matchValidator');
const { verifyApiKey } = require('../middlewares/apiKeyMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', verifyApiKey, matchController.getMatches);
router.post('/', verifyApiKey, createMatchValidators, matchController.createMatch);
router.put('/:id', verifyApiKey, updateMatchValidators, matchController.updateMatch);
router.put('/:id/datetime', verifyApiKey, updateMatchDateTimeValidators, matchController.updateMatchDateTime);
router.delete('/all', verifyApiKey, authMiddleware.verificarToken, matchController.deleteAllMatches);
router.delete('/:id', verifyApiKey, matchController.deleteMatch);

module.exports = router;