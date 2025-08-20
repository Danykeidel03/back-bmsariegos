const { body, validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const createTeamValidators = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser un texto'),

  body('category')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isString().withMessage('La categoría debe ser un texto'),

  body('division')
    .notEmpty().withMessage('La división es obligatoria')
    .isString().withMessage('La división debe ser un texto'),

  validateResult
];

module.exports = createTeamValidators;