import express from "express" ;
import bookRoutes from './router/bookRoutes.js'
import searchBookRoutes from './router/searchBookRoutes.js'
import sortBookRoutes from './router/sortBookRoutes.js'
import isAvailableRoutes from './router/isAvailableRoutes.js'
import userRoutes from './router/userRoutes.js'
import cookieParser from "cookie-parser";


const app = express()


app.use(cookieParser())
app.use(express.json())

app.use("/api/v1/book" , bookRoutes)
app.use("/api/v2/book" , searchBookRoutes)
app.use("/api/v3/book" , sortBookRoutes)
app.use("/api/v4/book" , isAvailableRoutes)
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