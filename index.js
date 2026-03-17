import express from 'express'
import mongoose from 'mongoose'
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import authorization from './lib/jwtMiddleware.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()


let mongoURL = process.env.MONGO_URL
mongoose.connect(mongoURL).then(
    ()=>{
        console.log("mongodd conected")
    }
).catch(
    ()=>{
        console.log("mongodb connecting fail")
    }
)

let app = express() 
app.use(cors())
app.use(express.json())

app.use(authorization)

app.use("/api/user",userRouter)
app.use("/api/products",productRouter)



app.listen(3000,
    ()=>{
        console.log("server started")
    }
)

