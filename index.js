import express from 'express'
import mongoose from 'mongoose'
import userRouter from './router/userRouter.js'
import productRouter from './router/productRouter.js'
import authorization from './lib/jwtMiddleware.js'



let mongoURL = "mongodb+srv://admin:1234@cluster0.qbjvpzs.mongodb.net/?appName=Cluster0"
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
app.use(express.json())

app.use(authorization)

app.use("/user",userRouter)
app.use("/products",productRouter)



app.listen(3000,
    ()=>{
        console.log("server started")
    }
)

