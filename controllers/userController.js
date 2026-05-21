import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
import { json } from "express";
import axios from "axios";
dotenv.config()

const transporter = nodemailer.createTransport({
    service : "gmail",
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : "aidiploma16@gmail.com",
        pass : process.env.GMAIL_APP_PASSWORD
    }
     
})

export function createUser(req,res){
    
    // Validate required fields
    if (!req.body.email || !req.body.email.trim()) {
        res.status(400).json({
            message: "Email is required"
        });
        return;
    }
    
    if (!req.body.firstName || !req.body.firstName.trim()) {
        res.status(400).json({
            message: "First name is required"
        });
        return;
    }
    
    if (!req.body.lastName || !req.body.lastName.trim()) {
        res.status(400).json({
            message: "Last name is required"
        });
        return;
    }
    
    if (!req.body.password || !req.body.password.trim()) {
        res.status(400).json({
            message: "Password is required"
        });
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        res.status(400).json({
            message: "Invalid email format"
        });
        return;
    }
    
    // Validate password length
    if (req.body.password.length < 6) {
        res.status(400).json({
            message: "Password must be at least 6 characters long"
        });
        return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword,
            role : req.body.role
        }
    )
    user.save().then(
    ()=>{
        res.json({
            message : "User created successfully"
        })
    }
).catch(
    ()=>{
        res.json(
            {
                message: "User creation failed"
            }
        )
    }
)

}
 
export function loginUser(req,res){
    
    // Validate required fields
    if (!req.body.email || !req.body.email.trim()) {
        res.status(400).json({
            message: "Email is required"
        });
        return;
    }
    
    if (!req.body.password || !req.body.password.trim()) {
        res.status(400).json({
            message: "Password is required"
        });
        return;
    }
    
    User.findOne(
        {
            email : req.body.email,
        
        }
    ).then(
        (user)=>{
            if (user == null){
                res.status(404).json({
                    message : "User with given emagil not found"
                })
            }else{
                if(user.isBlocked){
                    res.status(403).json({message : "You account is blocked. pleas contact support for more infomation"})
                    return
                }
                const isPasswordValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );
                if(isPasswordValid){
                    const token = jwt.sign({
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        image: user.image,
                        isEmailVerified : user.isEmailVerified

                    },
                    process.env.JWT_SECRET,
                    //{expiresIn: req.body.rememberme ? "30d": "48"}
                );
                    console.log(token);
                    console.log({
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        isEmailVerified : user.isEmailVerified
                    });
                    res.json({
                        message : "Login Successfull",
                        token : token,
                        role: user.role
                    });
                }else{
                     res.status(401).json({
                        message : "Invalid Password"
                    })
                }
                
            }

        }
    ).catch(() =>{
        
        res.status(500).json(
            {
                massege : "internal server error"
            }
        )
    })
}


export function getUser(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Unauthorized"
        })
        return
    }

    res.json({
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        image: req.user.image,
        isEmailVerified: req.user.isEmailVerified,
    })
}


export async function updateUserProfile(req, res) {

    if(req.user == null){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{

        await User.updateOne(
            { email: req.user.email },
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                image: req.body.image
            }
        );

        // get updated user
        const user = await User.findOne({
            email: req.user.email
        });

        // create new token
        const token = jwt.sign(
            {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                image: user.image,
                isEmailVerified:
                    user.isEmailVerified
            },
            process.env.JWT_SECRET
        );

        res.json({
            message:
                "Profile updated successfully",
            token: token
        });

    }catch(error){

        res.status(500).json({
            message:
                "Error updating profile",
            error: error.message
        });
    }
}


export async function changeUserPassword(req, res) {

    if(req.user == null){
        res.status(401).json({
            message: "Unauthorized"
        });
        return;
    }

    try{

        const hashedPassword =
            bcrypt.hashSync(
                req.body.password,
                10
            );

        await User.updateOne(
            { email: req.user.email },
            { password: hashedPassword }
        );

        res.json({
            message:
                "Password changed successfully"
        });

    }catch(error){

        res.status(500).json({
            message:
                "Error changing password",
            error: error.message
        });
    }
}

export function isAdmin(req){
    if(req.user == null){
        return false
    }
    if(req.user.role == "admin"){
 
        return true
        
    }else{
        return false
        
    }
}

export async function sendOTP(req, res){

    try{

        const user = await User.findOne({
            email : req.body.email
        })

        if(user == null){

            return res.status(404).json({
                message : "User not found"
            })

        }

        // generate OTP
        const otp = Math.floor(
            10000 + Math.random() * 90000
        )

        // delete old OTP
        await OTP.deleteMany({
            email : req.body.email
        })

        // create new OTP
        const newOTP = new OTP({
            email : req.body.email,
            otp : otp
        })

        await newOTP.save()

        const message = {

            from : "pasiduc79@gmail.com",
            to : req.body.email,
            subject : "Your OTP for password reset",

            text :
            "Your OTP for password reset is "
            + otp +
            ". It is valid for 10 minutes."

        }

        // send email
        const info = await transporter.sendMail(
            message
        )

        console.log(
            "Email sent successfully",
            info.response
        )

        return res.json({
            message :
            "OTP sent successfully"
        })

    }catch(error){

        console.log(
            "Error sending OTP",
            error
        )

        return res.status(500).json({
            message : "Error sending OTP",
            error : error.message
        })

    }

}

export async function verifyOTP(req, res) {

    try{

        const otpCode = Number(
            req.body.otp
        )

        const email =
            req.body.email

        const newPassword =
            req.body.newPassword

        const otpRecord =
            await OTP.findOne({
                email : email
            })

        if(otpRecord == null){

            return res.status(404).json({
                message :
                "OTP not found for the given email"
            })

        }

        if(otpRecord.otp != otpCode){

            return res.status(400).json({
                message : "Invalid OTP"
            })

        }

        const hashedPassword =
            bcrypt.hashSync(
                newPassword,
                10
            )

        await User.updateOne(
            {
                email : email
            },
            {
                password :
                hashedPassword
            }
        )

        // delete used OTP
        await OTP.deleteMany({
            email : email
        })

        return res.json({
            message :
            "Password reset successful"
        })

    }catch(error){

        console.log(error)

        return res.status(500).json({
            message :
            "Error verifying OTP",
            error :
            error.message
        })

    }

}

export async function googleLogin(req, res) {

    try {

        const googleResponse =
            await axios.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization:
                            "Bearer " +
                            req.body.token
                    }
                }
            );

        console.log(
            "Google User Data:",
            googleResponse.data
        );

        // Find user
        let user =
            await User.findOne({
                email:
                    googleResponse.data.email
            });

        // Create user if not exists
        if (user == null) {

            user = new User({

                email:
                    googleResponse.data.email,

                firstName:
                    googleResponse.data.given_name,

                lastName:
                    googleResponse.data.family_name,

                password:
                    "google-login",

                image:
                    googleResponse.data.picture,

                role:
                    "customer",

                isBlocked:
                    false,

                isEmailVerified:
                    true

            });

            await user.save();
        }

        // BLOCKED USER CHECK
        if (user.isBlocked) {

            return res.status(403).json({

                message:
                    "You account is blocked. pleas contact support for more infomation"

            });
        }

        // Generate JWT Token
        const token = jwt.sign(

            {
                email:
                    user.email,

                firstName:
                    user.firstName,

                lastName:
                    user.lastName,

                role:
                    user.role,

                image:
                    user.image,

                isEmailVerified:
                    user.isEmailVerified,

                isBlocked:
                    user.isBlocked
            },

            process.env.JWT_SECRET,

            {
                expiresIn:
                    req.body.rememberme
                        ? "30d"
                        : "48h"
            }

        );

        return res.json({

            message:
                "Google login successful",

            token:
                token,

            role:
                user.role

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            message:
                "Error logging in with Google",

            error:
                error.message

        });

    }
}

export async function getAllUsers(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Forbidden"
        });
        return;
    }

    try {
        const pageSizeInString = req.params.pageSize || "10";
        const pageNumberInString = req.params.pageNumber || "1";

        const pageSize = parseInt(pageSizeInString);
        const pageNumber = parseInt(pageNumberInString);

        const numberOfUsers = await User.countDocuments();
        const numberOfPages = Math.ceil(numberOfUsers / pageSize);

        const users = await User.find({})
            .sort({ date: -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        res.json({
            users: users,
            totalPages: numberOfPages
        });

    } catch (error) {
        res.status(500).json({
            message: "Error getting users",
            error: error.message
        });
    }
}

export async function blockOrUnblockUser(req, res) {

    if(!isAdmin(req)){
        res.status(403).json(
            {message : "Forbidden"}
        )
        return
    }
    const email = req.body.email

    if(req.user.email == email){
        res.status(400).json({
            message : "You cannot block yourself"
        })
        return
    }
    try{
        const user = await User.findOne({email : email})

        if(user == null){
            res.status(404).json({message : "User with given email not found"})
            return
        }
        await User.updateOne({email : email}, {isBlocked : !user.isBlocked})
        res.json({message : user.isBlocked ? "User unblocked successfully": "User blocked successfully"})
    }catch(error){
        res.status(500).json({message : "Error blocking/unblocing user", error : error})
    }
    
}


export async function changeRole(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Forbidden"
        });
        return;
    }

    const email = req.body.email;

    if (req.user.email == email) {
        res.status(400).json({
            message: "You cannot change your own role"
        });
        return;
    }

    try {

        const user = await User.findOne({
            email: email
        });

        if (user == null) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        const newRole =
            user.role === "admin"
                ? "customer"
                : "admin";

        await User.updateOne(
            { email: email },
            { role: newRole }
        );

        res.json({
            message:
                `User role changed to ${newRole}`
        });

    } catch (error) {

        res.status(500).json({
            message: "Error changing role",
            error: error.message
        });
    }
}