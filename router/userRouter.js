import express from "express"
import { changeUserPassword, createUser, getUser, loginUser, updateUserProfile } from "../controllers/userController.js"
import authorization from "../lib/jwtMiddleware.js"



const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.post("/update-password",changeUserPassword)
userRouter.put("/profile", updateUserProfile)
userRouter.get("/profile",authorization, getUser)


export default userRouter;