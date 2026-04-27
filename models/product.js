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
        labelledPrice : {
            type : Number
        },
        category : {
            type : String,
            default : "Others"
        },
        images : {
            type : [String],
            default : ["/images/default-product-1.png","/images/default-product-2.png"]
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