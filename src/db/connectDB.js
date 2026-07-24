import mongoose, { Mongoose } from "mongoose" ;

async function connectDB(){
    await mongoose.connect("mongodb://localhost:27017/library")
    console.log(">> Databse connected.")
}

export default connectDB