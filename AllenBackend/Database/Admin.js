const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Admin = new Schema({
    email:{type:String, unique:true},
    password:{ type: String, required: true },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    }
});

const AdminModel = mongoose.model("Admins", Admin);

module.exports={
    AdminModel,
}