import mongoose from "mongoose";
import { timeStamp } from "node:console";

const loginRequest = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    } ,
    generateTime : {
        type : Date ,
        default : new Date() ,
    }, 
    expireTime : {
        type : Date ,
        required : true
    } ,
    OTP : {
        type : Number ,
        required : true
    } ,
    usedStatus : {
        type : Boolean ,
        enum : ["true" , "false"] ,
        default : false
    }
} , {
    timeStamp : true
})

const loginRequestModel = new mongoose.model("loginRequest" , loginRequest)

export default loginRequestModel ;