  const { body } = require('express-validator');

  exports.addValidation = [
  body('productname')
    .notEmpty()
    .withMessage('Product Name is required')
    .isLength({ min: 3 })
    .withMessage('Product Name must be at least 3 characters'),
  body('code')
    .notEmpty()
    .withMessage('code is required')
    ];
