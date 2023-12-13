const express = require("express");
const { signup, signin, userInfo } = require("../controllers/userController");
const auth = require("../middleware/auth");
const userRouter = express.Router();


userRouter.post("/signup",signup)
userRouter.post("/signin",signin)
userRouter.get("/userinfo",auth,userInfo)


module.exports = userRouter