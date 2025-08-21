const { body, validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createMatchValidators = [
  body('rivalTeam')
    .notEmpty().withMessage('El equipo rival es obligatorio')
    .isMongoId().withMessage('ID de equipo rival no válido'),

  body('ownTeam')
    .notEmpty().withMessage('El equipo propio es obligatorio')
    .isMongoId().withMessage('ID de equipo propio no válido'),

  body('date')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),

  body('time')
    .notEmpty().withMessage('La hora es obligatoria')
    .isString().withMessage('La hora debe ser un texto'),

  body('location')
    .notEmpty().withMessage('El lugar es obligatorio')
    .isString().withMessage('El lugar debe ser un texto'),

  body('isHome')
    .notEmpty().withMessage('El tipo de partido (local/suplente) es obligatorio')
    .isBoolean().withMessage('El tipo de partido debe ser verdadero o falso'),

  validateResult
];

const updateMatchValidators = [
  body('result')
    .notEmpty().withMessage('El resultado es obligatorio')
    .isString().withMessage('El resultado debe ser un texto'),

  body('completed')
    .notEmpty().withMessage('El estado completado es obligatorio')
    .isNumeric().withMessage('El estado completado debe ser un número'),

  validateResult
];

const updateMatchDateTimeValidators = [
  body('date')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),

  body('time')
    .notEmpty().withMessage('La hora es obligatoria')
    .isString().withMessage('La hora debe ser un texto'),

  validateResult
];

module.exports = { createMatchValidators, updateMatchValidators, updateMatchDateTimeValidators };