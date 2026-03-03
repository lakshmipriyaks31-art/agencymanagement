  const { body } = require('express-validator');

  exports.addValidation = [
  // body('orderId')
  //   .notEmpty()
  //   .withMessage('Order Id is required'),
  body('companyId')
      .notEmpty()
      .withMessage('Company Name is required'),
  body('clientId')
      .notEmpty()
      .withMessage('Client Name is required'),
   
  ];
