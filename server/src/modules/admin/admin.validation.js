  const { body } = require('express-validator');

  exports.registerValidation = [
  body('username')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('mobile')
    .notEmpty()
    .withMessage('Mobile is required')
    .isLength({ min: 10,max:10 })
    .withMessage('Mobile number must be 10 numbers'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  ];

  exports.loginValidation = [
   body('mobile')
    .notEmpty()
    .withMessage('Mobile is required')
    .isLength({ min: 10,max:10 })
    .withMessage('Mobile number must be 10 numbers'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  ];
const existsOptions = {
    checkNull: true,
    checkFalsy: true
};

  
  exports.editValidation = [
  body('username')
    // .exists(existsOptions)
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters'),
  body('mobile')
    .exists(existsOptions)
   .isLength({ min: 10,max:10 })
    .withMessage('Mobile number must be 10 numbers'),
  body('password')
  .exists(existsOptions)
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  ];