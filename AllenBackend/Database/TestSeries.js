const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Test_Series=new Schema({
    title:{type:String},
    statement:{
        type:String
    },
    price:{
        type:String
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

const Test_SeriesModel = mongoose.model("Test_Series", Test_Series);

module.exports={
    Test_SeriesModel,
}