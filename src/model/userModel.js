import mongoose from 'mongoose' ;
import { match } from 'node:assert';

const userSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : true 
    } ,
    email : {
        type : String ,
        required : true ,
        trim : true , 
        lowercase : true ,
        unique : true ,
        match : [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },
    password : {
        type : String ,
        required : true
    },
    role : {
        type : String ,
        enum : ["admin" , "user"] ,
        default : "user"
    } , 
    refreshToken : {
        type : String , 
        default : null 
    }
},
{
    timestamps : true
})

const userModel = mongoose.model("user" , userSchema)
export default userModel;