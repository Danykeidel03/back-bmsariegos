const { body, validationResult } = require('express-validator');

// Middleware para validar resultados
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validadores para crear usuario
const createUserValidators = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),

  body('mail')
    .notEmpty().withMessage('El mail es obligatorio')
    .isString().withMessage('El mail debe ser un texto'),

  validateResult
];

module.exports = createUserValidators;
