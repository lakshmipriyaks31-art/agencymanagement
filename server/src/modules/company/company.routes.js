const express = require("express")
const route = express.Router()
const companyController = require('./company.controller')
const logger = require("../../config/logger")
const asyncHandler = require("../../utils/asyncHandler")
const { addValidation, editValidation } = require('./company.validation');
const validate = require('../../middleware/validation.middleware');
const authController = require('../../middleware/auth.middleware')



//register company module
route.post("/",
     addValidation,
     validate,
     asyncHandler(companyController.add)
)
route.patch("/:id",
    authController,
     editValidation,
     validate,
     asyncHandler(companyController.edit)
)

route.delete("/:id",
    authController,
    asyncHandler(companyController.delete)
)
route.get("/list",
     authController,
     asyncHandler(companyController.listallcompany)
)


route.get("/:id",
     authController,
     asyncHandler(companyController.profile)
)

module.exports=route