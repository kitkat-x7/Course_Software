const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();
const app=express();
app.use(express.json());
const {CourseModel}=require("../Database/Course.js");
const {Course_PurchaseModel}=require("./../Database/Purchase.js");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const { ObjectId } = require('mongodb');
const { verifyuser }=require("../Middleware/Userverify.js")
const {JWT_USER_SECRET}=require("../Config/config.js");

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/Course_Storage");

router.get("/",async (req,res)=>{
    try{
        const courses=await CourseModel.find();
        res.json(courses);
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/coursename",async (req,res)=>{
    const {CourseId}=req.body;
    try{
        const course=await CourseModel.findOne({_id:CourseId});
        if(!course){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            course,
        });
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.use(verifyuser);

router.post("/purchase",async (req,res)=>{
    const {courseId}=req.body;
    try{
        const course=await CourseModel.findOne({_id:courseId});
        if(!course){
            return res.status(404).json({ message: "Course not found"});
        }
        await Course_PurchaseModel.create({UserId:req.userId,courseId});
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