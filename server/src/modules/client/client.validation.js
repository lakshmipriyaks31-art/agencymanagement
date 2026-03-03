  const { body } = require('express-validator');

  exports.addValidation = [
  body('clientname')
    .notEmpty()
    .withMessage('Client Name is required')
    .isLength({ min: 3 })
    .withMessage('Client Name must be at least 3 characters'),
  body('mobile')
    .notEmpty()
    .withMessage('Mobile is required')
    .isLength({ min: 10,max:10 })
    .withMessage('Mobile number must be 10 numbers'),
   ];


 