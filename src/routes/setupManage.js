const express = require('express');
const setupController = require('../controllers/setupController');

const router = express.Router();

router.post('/clasificaciones', setupController.setupClasificaciones);

module.exports = router;