import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email : {
       type : String,
       require : true,
       unique :true
    },

    firstName :{
       type : String,
       require : true
    }, 

    lastName : {
        type : String,
       require : true
    },

    password : {
        type : String,
        require : true

    },

    role : {
        type : String,
        require :true,
        enum : ["admin","customer"],
        default : "customer"
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    image : {
        type : String,
        default : "/images/default-profile.png"
    }
})

const User = mongoose.model("User",userSchema)

export default User;
