const express = require("express")
const route = express.Router()
const orderController = require('./order.controller')
const logger = require("../../config/logger")
const asyncHandler = require("../../utils/asyncHandler")
const { addValidation } = require('./order.validation');
const validate = require('../../middleware/validation.middleware');
const authController = require('../../middleware/auth.middleware')



//register order module
route.post("/",
     authController,
     addValidation,
     validate,
     asyncHandler(orderController.add)
)
route.patch("/:id",
    authController,
     addValidation,
     validate,
     asyncHandler(orderController.edit)
)

route.delete("/:id",
    authController,
    asyncHandler(orderController.delete)
)
route.get("/list",
     authController,
     asyncHandler(orderController.listallorder)
)


route.get("/:id",
     authController,
     asyncHandler(orderController.profile)
)

module.exports=route