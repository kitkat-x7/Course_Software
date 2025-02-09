const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();
const app=express();
app.use(express.json());
const {AdminModel}=require("../Database/Admin.js");
const {CourseModel}=require("../Database/Course.js");
const {Test_SeriesModel}=require("./../Database/TestSeries.js");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const { ObjectId } = require('mongodb');
const { verifyadmin }=require("../Middleware/Adminverify.js");
const {JWT_ADMIN_SECRET}=require("../Config/config.js");

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/Course_Storage");

router.post("/signup",async (req,res)=>{
    const {email,password,firstname,lastname}=req.body;
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await AdminModel.findOne({email});
    if (existingUser){
        return res.status(400).json({ error: "User already exists" });
    }
    const hashpass=await bcrypt.hash(password, 10);
    try{
        await AdminModel.create({
            email,
            password:hashpass,
            firstname,
            lastname,
        });
        return res.json({message:"Admin Sign Up Successfull."});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: e.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});
//ABC
router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const User=await AdminModel.findOne({
            email,
        });
        if(!User){
            return res.status(404).json({ message: "Admin not found"});
        }
        const stored_pass=User.password;
        const isPasswordValid = await bcrypt.compare(password,stored_pass);
        if(isPasswordValid){
            const token=jwt.sign({id:User._id},JWT_ADMIN_SECRET);
            const time = 30*60*1000;
            res.cookie("admintoken",token,{
                maxAge:time
            });
            res.status(200).json({
                message:"User Signed In!",
            });
        }else{
            return res.status(403).json({ message: "Incorrect Password or Email !!!!" });
        }
    }catch(err){
        console.error("Error occurred:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.use(verifyadmin);
router.get("/:username",async (req,res)=>{
    try{
        const username = req.params.username;
        const user=await AdminModel.findOne({
            _id:req.userId
        });
        if(!user){
            return res.status(404).json({ message: "Admin not found"});
        }
        const fullName = `${user.firstname}-${user.lastname}`;
        if (fullName === username) {
            return res.json({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            });
        }else{
            res.status(403).json({ message: "Forbidden! Unauthenticated access." });
        }
    }catch (err) {
        console.error("Error occurred:", e);
        if (e.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.put("/edit/:username",async (req,res)=>{
    const {email,firstname,lastname}=req.body;
    try{
        const status=await AdminModel.findOneAndUpdate({
            _id:req.userId
        },{
            email,
            firstname,
            lastname
        });
        if (!status) {
            return res.status(404).json({ message: "Admin not found" });
        }
        return res.status(200).json({
            message:"Profile Edited Successfully",
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.delete("/delete/:username",verifyadmin,async (req,res)=>{
    try{
        const status=await AdminModel.findOneAndDelete({
            _id:req.userId
        });
        if(!status){
            return res.status(404).json({ message: "Test not found"});
        }
        res.json({message:"Deleted Successfully"});
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.post("/createcourse",async (req,res)=>{
    const {title,statement,price,imageurl,description}=req.body;
    try{
        await CourseModel.create({
            title:title,
            statement:statement,
            price:price,
            imageurl:imageurl,
            description:description,
            createrId:req.userId
        });
        const courseId=await CourseModel.findOne({
            title,
            createrId:req.userId,
        });
        res.status(201).json({ message: "Course created successfully", courseId:courseId });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: e.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});



router.post("/createtest",async (req,res)=>{
    const {title,statement,price,imageurl,description}=req.body;
    try{
        await Test_SeriesModel.create({
            title:title,
            statement:statement,
            price:price,
            imageurl:imageurl,
            description:description,
            createrId:req.userId
        });
        const TestseriesId=await Test_SeriesModel.findOne({
            title,
            createrId:req.userId,
        });
        res.status(201).json({ message: "Test created successfully", TestseriesId });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: e.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});

router.put("/editcourse",async (req,res)=>{
    const {title,statement,price,imageurl,description,CourseId}=req.body;
    try{
        const status=await CourseModel.findOneAndUpdate({_id:CourseId,createrId:req.userId},
            {
                title,
                statement,
                price,
                imageurl,
                description,
            }
        );
        if(!status){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            message:"Course Updated."
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.put("/edittest",async (req,res)=>{
    const {title,statement,price,imageurl,description,TestseriesId}=req.body;
    try{
        const status=await Test_SeriesModel.findOneAndUpdate({_id:TestseriesId,createrId:req.userId},
            {
                title,
                statement,
                price,
                imageurl,
                description,
            }
        );
        if(!status){
            return res.status(404).json({ message: "Test not found"});
        }
        res.json({
            message:"Test Updated."
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});



router.post("/deletecourse",async (req,res)=>{
    const {CourseId}=req.body;
    try{
        const status=await CourseModel.findOneAndDelete({_id:CourseId,createrId:req.userId});
        if(!status){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            message:"Course Deleted."
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid Creater ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.post("/deletetest",async (req,res)=>{
    const {TestseriesId}=req.body;
    try{
        const status=await Test_SeriesModel.findOneAndDelete({_id:TestseriesId,createrId:req.userId});
        if(!status){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            message:"Test Deleted."
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid Creater ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


router.post("/getcourse",async (req,res)=>{
    const {CourseId}=req.body;
    try{
        const course=await CourseModel.findOne({_id:CourseId,createrId:req.userId});
        if(!course){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            course,
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid Creater ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.post("/gettest",async (req,res)=>{
    const {TestseriesId}=req.body;
    try{
        const test=await Test_SeriesModel.findOne({_id:TestseriesId,createrId:req.userId});
        if(!test){
            return res.status(404).json({ message: "Course not found"});
        }
        res.json({
            test,
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid Creater ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/mycourse",async (req,res)=>{
    try{
        const course=await CourseModel.find({createrId:req.userId});

        res.json({
            course,
        });
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/mytests",async (req,res)=>{
    try{
        const test=await Test_SeriesModel.find({createrId:req.userId});
        res.json({
            test,
        });
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;