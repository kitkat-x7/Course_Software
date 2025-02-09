const express=require('express');
const app=express();
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const {JWT_USER_SECRET}=require("../Config/config.js");
// const cookieParser = require("cookie-parser");
const cookieParser = require('cookie-parser');
app.use(cookieParser());

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/Course_Storage");
app.use(express.json());
app.use(cookieParser());
function verifyuser(req,res,next) {
    // console.log("Cookies:", req.cookies);
    const token=req.cookies?.usertoken;
    if (!token) {
        return res.status(401).json({ message: "No Token Found! Please log in." });
    }
    // console.log(token);
    try{
        const decodedtoken=jwt.verify(token,JWT_USER_SECRET);
        req.userId=decodedtoken.id;
        next();
    }catch(err){
        if (err.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Invalid Token! Please log in." });
        } else if (err.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token Expired! Please login again." });
        } else {
            res.status(500).json({ message: "Server Error" });
        }
    }
}

module.exports={
    verifyuser,
}