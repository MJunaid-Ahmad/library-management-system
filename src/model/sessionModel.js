import mongoose from "mongoose";
import { type } from "node:os";

const session = new mongoose.Schema({
   userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user',
        required : true 
    } ,
    refreshToken : {
        type : String ,
        required : true 
    } ,
    accessToken : {
        type: String
    } ,
    device : {
        type : String 
    },
    browser : {
        type : String
    },
    ipAddress : {
        type : String 
        },
    loginTime : {
        type : Date , 
        default : Date.now()
    } ,
    lastActivity : {
        type : Date ,
        default : Date.now()
    } ,
    expiresAt : {
        type : Date , 
        required : true
    } ,
    isActive : {
        type : Boolean ,
        default : true 
    } ,
    logoutTime : {
        type : Date ,
        default : null
    }
} , {
    timestamps : true
})

const sessionModel = new mongoose.model('session' , session)

export default sessionModel;