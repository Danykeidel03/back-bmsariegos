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
const createNoticeValidators = [
  body('title')
    .notEmpty().withMessage('El titulo es obligatorio')
    .isString().withMessage('El titulo debe ser un texto'),

  body('descripcion')
    .notEmpty().withMessage('La descripcion es obligatorio')
    .isString().withMessage('La descripcion debe ser un texto'),

  body('category')
    .optional()
    .isIn(['general', 'deportiva']).withMessage('La categoria debe ser "general" o "deportiva"'),

  validateResult
];

module.exports = createNoticeValidators;
