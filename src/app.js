import cookieParser from "cookie-parser";
import express from "express";
import bookRoutes from './router/bookRoutes.js';
import userRoutes from './router/userRoutes.js';


const app = express()


app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/book" , bookRoutes)
app.use("/api/v1/user" , userRoutes)


app.use((err , req , res , next)=> {

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else{
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
})


export default app ;