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

app.get("/",(req,res)=>{
    res.json({
        message:"Careers will be updated Soon.",
    })
});

