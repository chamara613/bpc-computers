import jwt from "jsonwebtoken"

export default function authorization(req,res,next){
        
        const header = req.header("Authorization")
        

        if(header != null){
            const token = header.replace("Bearer ", "")
            
            jwt.verify(token,"bpc-computers-613",
                (err,decoded)=>{
                    
                    req.user = decoded
                    if(decoded == null){
                        res.status(401).json({
                            message: "Invalide token pleas login again"
                        })
                    }else{
                        req.user = decoded
                        next()
                    }
                }
            )
        }else{
            next()
        }

    
    }