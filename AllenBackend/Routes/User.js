const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();
const app=express();
app.use(express.json());
const {UserModel}=require("../Database/User.js");
const {Course_PurchaseModel,Test_PurchaseModel}=require("./../Database/Purchase.js");
const {CourseModel}=require("../Database/Course.js");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const cookieParser = require('cookie-parser');
const { verifyuser }=require("../Middleware/Userverify.js")
const {JWT_USER_SECRET}=require("../Config/config.js");
const { Test_SeriesModel } = require('../Database/TestSeries.js');
app.use(cookieParser());

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/Course_Storage");
router.post("/signup",async (req,res)=>{  
    const {email,password,firstname,lastname}=req.body;
    if (!email || !password || !firstname || !lastname) {
        return res.status(400).json({ error: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({email});
    if (existingUser){
        return res.status(400).json({ error: "User already exists" });
    }
    const hashpass=await bcrypt.hash(password, 10);
    try{
        await UserModel.create({
            email,
            password:hashpass,
            firstname,
            lastname,
        });
        return res.json({message:"User Sign Up Successfull."});
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

router.post("/signin",async (req,res)=>{
    const {email,password}=req.body;
    try{
        const User=await UserModel.findOne({
            email,
        });
        if(!User){
            return res.status(404).json({ message: "Email not found"});
        }
        const stored_pass=User.password;
        const isPasswordValid = await bcrypt.compare(password,stored_pass);
        if(isPasswordValid){
            const token=jwt.sign({id:User._id},JWT_USER_SECRET,{expiresIn:"30m"});
            const time = 30*60*1000;
            res.cookie("usertoken", token, {
                maxAge: time,
            });
            res.status(200).json({
                message:"User Signed In!",
            });
        }else{
            return res.status(403).json({ message: "Forbidden! Wrong Password!" });
            //Don't keep your code in catch
            // Status Codes 4 - series for client 5 server 2 acccepted 
        }
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.use(verifyuser);

router.get("/signout",async (req,res)=>{
    res.clearCookie('usertoken');
    res.status(200).json({
        message:"User Logged Out!",
    });
});

router.get("/:username",async (req, res) => {
    try {
        const username = req.params.username;
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const fullName = `${user.firstname}-${user.lastname}`;

        if (fullName === username) {
            return res.json({
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
            });
        } else {
            return res.status(403).json({ message: "Forbidden! Unauthenticated access." });
        }
    } catch (err) {
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


// /user/id

// rest full APIs
// put vs patch vs post
router.put("/edit/:username",async (req,res)=>{
    const {email,firstname,lastname}=req.body;
    try{
        const status=await UserModel.findOneAndUpdate({
            _id:req.userId
        },{
            email,
            firstname,
            lastname
        });
        if (!status) {
            return res.status(404).json({ message: "User not found" });
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

// /user/:id
// it should be generic what is send

// delete user make user specific
// close the session
// make two catch 404 if data not found and 500 other server error
router.delete("/delete/:username",async (req,res)=>{
    try{
        const status=await UserModel.findOneAndDelete({
            _id:req.userId
        });
        if (!status) {
            return res.status(404).json({ message: "User not found" });
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

router.get("/mycourses",async (req,res)=>{
    try{
        const data=await Course_PurchaseModel.find({UserId:req.userId});
        let Courses=[];
        let course_data;
        for(Id in data){
            course_data=await CourseModel.find(data[Id]['courseId']);
            Courses.push(course_data);
        }
        res.json(Courses);
    }catch(e){
        res.status(500).json({message: "Internal Server Error"});
    }
});

router.get("/mytestseies",async (req,res)=>{
    try{
        const data=await Test_PurchaseModel.find({UserId:req.userId});
        console.log(data);
        let Tests=[];
        let test_data;
        for(Id in data){
            test_data=await Test_SeriesModel.find(data[Id]['testId']);
            Tests.push(test_data);
        }
        res.json(Tests);
    }catch(e){
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;