
import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export function createUser(req,res){

    const hashedPassword = bcrypt.hashSync(req.body.password,10)

    const user = new User(
        {
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : hashedPassword
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
            email : req.body.email
        
        }
    ).then(
        (User)=>{
            if (User == null){
                res.json({
                    message : "User with given emagil is not found"
                })
            }else{
                const isPasswordValid = bcrypt.compareSync(req.body.password,User.password)
                if(isPasswordValid){
                    const token = jwt.sign({
                        email : User.email,
                        firstName : User.firstName,
                        lastName : User.lastName,
                        role : User.image,
                        isEmailVerified : User.isEmailVerified

                    },
                    "bpc-computers-613"
                );
                    console.log(token);
                    console.log({
                        email : User.email,
                        firstName : User.firstName,
                        lastName : User.lastName,
                        role : User.image,
                        isEmailVerified : User.isEmailVerified
                    });
                    res.json({
                        message : "login successfull",
                        token : token
                    })
                }else{
                     res.status(401).json({
                        message : "login is failed"
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