
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

export function createUser(req,res){

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
                        isEmailVerified : user.isEmailVerified

                    },
                    process.env.JWD_SECRET,
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