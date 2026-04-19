import mongoose  from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productId:{
            type : String,
            require :true,
            unique : true
        },
        name : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        altNames :{
            type : [String],
            default :[]
        },
        price : {
            type : Number,
            required : true
        },
        laballedprice : {
            type : Number
        },
        category : {
            type : String,
            default : "Others"
        },
        isVisible : {
            type : Boolean,
            default : true,
            required : true
        }

    }
)
const product = mongoose.model("product",productSchema)

export default product;