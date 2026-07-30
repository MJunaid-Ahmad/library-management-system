import { toRefreshToken}  from '../controller/userController.js';
import jwt from 'jsonwebtoken' ;
import dotenv  from 'dotenv';
dotenv.config()

async function isLogin(req , res , next){
    try{
        const accessToken = req.cookies.accessToken ;

        if(!accessToken){
            return res.status(401).json({
                success : false ,
                message : "Unauthorized" ,
            });
        }

        const decoded = await jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded ;

        next();
    }catch(err){
      return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
      });
    }
}

async function isAdmin(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!(decoded.role === "admin")) {
     return res.status(401).json({
      success: false,
      message: "Only admin can access",
    });      
    }

    req.user = decoded ;
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
}

export { isLogin , isAdmin } ;
