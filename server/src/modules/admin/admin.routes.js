const express = require("express")
const router = express.Router()
const adminController = require('./admin.controller')
const logger = require("../../config/logger")
const asyncHandler = require("../../utils/asyncHandler")
const { registerValidation,loginValidation, editValidation } = require('./admin.validation');
const validate = require('../../middleware/validation.middleware');
const authController = require('./../../middleware/auth.middleware')
const { adminRoleAuth } = require("../../middleware/roleAuth.middleware")

router.get("/",
     authController,
     adminRoleAuth,
     asyncHandler(adminController.list)
)
//register admin module
router.post("/register",
     registerValidation,
     validate,
     asyncHandler(adminController.register)
)
router.post("/login",
     loginValidation,
     validate,
     asyncHandler(adminController.login)
)
router.post("/logout",
     authController,
     asyncHandler(adminController.logout)
)
router.patch("/:id",
    authController,
     editValidation,
     validate,
     asyncHandler(adminController.edit)
)

router.delete("/:id",
    authController,
    asyncHandler(adminController.delete)
)




router.get("/profile/:id",
     authController,
     asyncHandler(adminController.profile)
)

module.exports=router