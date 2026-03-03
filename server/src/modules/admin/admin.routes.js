const express = require("express")
const route = express.Router()
const adminController = require('./admin.controller')
const logger = require("../../config/logger")
const asyncHandler = require("../../utils/asyncHandler")
const { registerValidation,loginValidation, editValidation } = require('./admin.validation');
const validate = require('../../middleware/validation.middleware');
const authController = require('./../../middleware/auth.middleware')

//register admin module
route.post("/register",
     registerValidation,
     validate,
     asyncHandler(adminController.register)
)
route.post("/login",
     loginValidation,
     validate,
     asyncHandler(adminController.login)
)
route.post("/logout",
     authController,
     asyncHandler(adminController.logout)
)
route.patch("/:id",
    authController,
     editValidation,
     validate,
     asyncHandler(adminController.edit)
)

route.delete("/:id",
    authController,
    asyncHandler(adminController.delete)
)


route.get("/list",
     authController,
     asyncHandler(adminController.list)
)

route.get("/profile/:id",
     authController,
     asyncHandler(adminController.profile)
)

module.exports=route