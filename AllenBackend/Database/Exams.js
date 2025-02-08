const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Exams=new Schema({
    title:{type:String},
    statement:{
        type:String
    },
    imageurl:{
        type:String
    },
    description:{
        type:ObjectId,
    },
    examId:{
        type:ObjectId,
    }
});

const ExamModel = mongoose.model("Exam", Exams);

module.exports={
    ExamModel,
}