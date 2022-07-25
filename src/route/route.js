const express = require('express');
const router= express.Router()
const user = require("../controllers/userController")
const MW = require("../Middleware/auth")
//const aws = require("aws-sdk")

//-------------------------------------User------------------------------------------------//

router.post("/register", user.createUser)

router.post("/login" , user.loginUser)

router.get("/user/:userId/profile",MW.authentication,user.getUser)

// router.put("PUT /user/:userId/profile",MW.authentication,user.updateUser)








module.exports = router;