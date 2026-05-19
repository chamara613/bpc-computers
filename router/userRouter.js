import express from "express"
import { blockOrUnblockUser, changeRole, changeUserPassword, createUser, getAllUsers, getUser, googleLogin, loginUser, sendOTP, updateUserProfile, verifyOTP } from "../controllers/userController.js"
import authorization from "../lib/jwtMiddleware.js"




const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.post("/update-password",changeUserPassword)
userRouter.post("/send-otp",sendOTP)
userRouter.post("/verify-otp", verifyOTP)
userRouter.post("/google-login",googleLogin)
userRouter.post("/block-user", blockOrUnblockUser)
userRouter.post("/update-role",changeRole )
userRouter.put("/profile", updateUserProfile)
userRouter.get("/profile",authorization, getUser)
userRouter.get("/all/:pageSize/:pageNumber", getAllUsers)

export default userRouter;