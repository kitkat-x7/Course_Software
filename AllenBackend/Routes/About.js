const express=require('express');
const bcrypt=require('bcrypt');
const router=express.Router();
const app=express();
app.use(express.json());
const {User}=require("./../Database/UserData.js");
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const JWT_SECRET="As You Like It";
const { ObjectId } = require('mongodb');

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav13@cluster0.nn3tf.mongodb.net/Course_Storage");

app.post("/",(req,res)=>{
    res.json({
        message:"About Us"
    })
});

app.post("/blog",(req,res)=>{
    res.json({
        message:"Blog"
    })
});

app.get("/news",(req,res)=>{
    res.json({
        message:"News"
    })
});

app.put("/privacy",(req,res)=>{
    res.json({
        message:"Privacy Policy"
    })
});

app.delete("/publicnotice",(req,res)=>{
    res.json({
        message:"Public Notice"
    })
});

app.post("/blog/blogname",(req,res)=>{
    res.json({
        message:"Blog"
    })
});