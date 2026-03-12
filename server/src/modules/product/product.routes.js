const express = require("express")
const route = express.Router()
const productController = require('./product.controller')
const logger = require("../../config/logger")
const asyncHandler = require("../../utils/asyncHandler")
const { addValidation } = require('./product.validation');
const validate = require('../../middleware/validation.middleware');
const authController = require('../../middleware/auth.middleware')



//register product module
route.post("/",
     authController,
     addValidation,
     addValidation,
     validate,
     asyncHandler(productController.add)
)
route.patch("/:id",
    authController,
     addValidation,
     validate,
     asyncHandler(productController.edit)
)

route.delete("/:id",
    authController,
    asyncHandler(productController.delete)
)
route.get("/list",
     authController,
     asyncHandler(productController.list)
)


route.get("/:id",
     authController,
     asyncHandler(productController.profile)
)

module.exports=route