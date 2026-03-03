const express = require("express")
const route = express.Router()
const clientController = require('./client.controller')
const logger = require("../../config/logger")
const asyncHandler = require("../../utils/asyncHandler")
const { addValidation, editValidation } = require('./client.validation');
const validate = require('../../middleware/validation.middleware');
const authController = require('../../middleware/auth.middleware')



//register client module
route.post("/",
     addValidation,
     validate,
     asyncHandler(clientController.add)
)
route.patch("/:id",
    authController,
     addValidation,
     validate,
     asyncHandler(clientController.edit)
)

route.delete("/:id",
    authController,
    asyncHandler(clientController.delete)
)
route.get("/list",
     authController,
     asyncHandler(clientController.listallclient)
)


route.get("/:id",
     authController,
     asyncHandler(clientController.profile)
)

module.exports=route