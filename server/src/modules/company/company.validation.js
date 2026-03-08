  const { body } = require('express-validator');

  exports.addValidation = [
  body('companyname')
    .notEmpty()
    .withMessage('Company Name is required')
    .isLength({ min: 3 })
    .withMessage('Company Name must be at least 3 characters'),
    body('slug')
    .notEmpty()
    .withMessage('Slug is required'),

  body('owner')
    .notEmpty()
    .withMessage('Owner Name is required')
    .isLength({ min: 3 })
    .withMessage('Owner Name must be at least 3 characters'),
  body('mobile')
    .notEmpty()
    .withMessage('Mobile is required')
    .isLength({ min: 10,max:10 })
    .withMessage('Mobile number must be 10 numbers'),
   ];


  exports.editValidation = [
  body('companyname')
    .notEmpty()
    .withMessage('Company Name is required')
    .isLength({ min: 3 })
    .withMessage('Company Name must be at least 3 characters'),
    body('slug')
    .notEmpty()
    .withMessage('Slug is required'),
  body('owner')
    .notEmpty()
    .withMessage('Owner Name is required')
    .isLength({ min: 3 })
    .withMessage('Owner Name must be at least 3 characters'),
  body('mobile')
    .notEmpty()
    .withMessage('Mobile is required')
    .isLength({ min: 10,max:10 })
    .withMessage('Mobile number must be 10 numbers'),
   ];