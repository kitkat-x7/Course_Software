const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const User= new Schema({
    email:{type:String, unique:true, required:true},
    password:{ type: String, required:true },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    }
});

const UserModel = mongoose.model("Users", User);

module.exports={
    UserModel,
}