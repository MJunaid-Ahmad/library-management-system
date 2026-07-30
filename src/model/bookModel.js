import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
    title : {
     type : String ,
     required : true 
    }, 
    author : {
     type : String ,
     required : true 
    },
    coverImage : {
        type : String ,
        required : true
    } ,
    category : {
     type : String ,
     required : true 
    },
    isbn : {
     type : Number ,
     required : true ,
     unique: true
    }, 
    publish : {
     type : Number ,
     required : true 
    },
    isAvailable : {
     type : Boolean ,
     default : true
    },
} , 
{
    timestamps : true
});

const bookModel = mongoose.model("books" , bookSchema);

export default bookModel;