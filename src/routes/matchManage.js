const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { createMatchValidators, updateMatchValidators, updateMatchDateTimeValidators } = require('../validations/matchValidator');
const { verifyApiKey } = require('../middlewares/apiKeyMiddleware');

router.get('/', verifyApiKey, matchController.getMatches);
router.post('/', verifyApiKey, createMatchValidators, matchController.createMatch);
router.put('/:id', verifyApiKey, updateMatchValidators, matchController.updateMatch);
router.put('/:id/datetime', verifyApiKey, updateMatchDateTimeValidators, matchController.updateMatchDateTime);

module.exports = router;