const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Course=new Schema({
    title:{
        type:String
    },
    statement:{
        type:String
    },
    price:{
        type:Number
    },
    imageurl:{
        type:String
    },
    description:{
        type:String,
    },
    createrId:{
        type:ObjectId, 
    },
});

const CourseModel = mongoose.model("Courses", Course);

module.exports={
    CourseModel,
}