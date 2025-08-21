const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { createMatchValidators, updateMatchValidators, updateMatchDateTimeValidators } = require('../validations/matchValidator');

router.get('/', matchController.getMatches);
router.post('/', createMatchValidators, matchController.createMatch);
router.put('/:id', updateMatchValidators, matchController.updateMatch);
router.put('/:id/datetime', updateMatchDateTimeValidators, matchController.updateMatchDateTime);

module.exports = router;