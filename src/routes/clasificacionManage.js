const express = require('express');
const clasificacionController = require('../controllers/clasificacionController');

const router = express.Router();

router.get('/clasificaciones', clasificacionController.getAllClasificaciones);
router.get('/clasificacion/:teamId', clasificacionController.getClasificacionByTeam);

module.exports = router;