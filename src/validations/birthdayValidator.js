const { body, validationResult } = require('express-validator');

// Middleware para validar resultados
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validadores para crear cumpleaños
const createBirthdayValidators = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),

  body('dni')
    .notEmpty().withMessage('El DNI es obligatorio')
    .isString().withMessage('El DNI debe ser un texto'),

  body('birthDay')
    .notEmpty().withMessage('La fecha de cumpleaños es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato válido (YYYY-MM-DD)'),

  body('category')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isString().withMessage('La categoría debe ser un texto'),

  validateResult
];

module.exports = createBirthdayValidators;