const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { createMatchValidators, updateMatchValidators } = require('../validations/matchValidator');

router.get('/', matchController.getMatches);
router.post('/', createMatchValidators, matchController.createMatch);
router.put('/:id', updateMatchValidators, matchController.updateMatch);

module.exports = router;