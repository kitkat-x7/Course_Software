const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Course_Purchase=new Schema({
    UserId:{
        type:ObjectId, 
    },
    courseId:{
        type:ObjectId,
    }
});

const Test_Purchase=new Schema({
    UserId:{
        type:ObjectId, 
    },
    testId:{
        type:ObjectId,
    }
});

const Course_PurchaseModel = mongoose.model("Course_Purchase", Course_Purchase);
const Test_PurchaseModel = mongoose.model("Test_Purchase", Test_Purchase);

module.exports={
    Course_PurchaseModel,
    Test_PurchaseModel,
}