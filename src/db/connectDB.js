import mongoose, { Mongoose } from "mongoose" ;
import dotenv from 'dotenv' ;

async function connectDB(){
    try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(">> Databse connected.")
}catch(err){
    console.log(err.message)
}
}

export default connectDB