const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();
const app=express();
app.use(express.json());
const {User}=require("../Database/User.js");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const JWT_SECRET="As You Like It";
const { ObjectId } = require('mongodb');
const {Test_SeriesModel}=require("./../Database/TestSeries.js");
const { CourseModel } = require('../Database/Course.js');
const { verifyuser }=require("../Middleware/Userverify.js")
const {Test_PurchaseModel } = require('../Database/Purchase.js');

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/Course_Storage");

router.get("/",async (req,res)=>{
    try{
        const test=await Test_SeriesModel.find();
        res.json(test);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/Testname",async (req,res)=>{
    const {TestId}=req.body;
    try{
        const test=await Test_SeriesModel.findOne({_id:TestId});
        if(!test){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            test,
        });
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});
router.use(verifyuser);

router.post("/purchase",async (req,res)=>{
    const {testId}=req.body;
    try{
        const test=await Test_SeriesModel.findOne({_id:courseId});
        if(!test){
            return res.status(404).json({ message: "Course not found"});
        }
        await Test_PurchaseModel.create({UserId:req.userId,testId});
        res.json({message:"Course Craeted"});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: e.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});

module.exports = router;