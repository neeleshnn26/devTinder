// - authRouter
// a. POST/signup
// b. POST/login
// c. POST/logout
const express = require("express")
const authRouter= express.Router()
const {validateSignupData}=require("../utils/validation")
const User=require("../models/user")
const bcrypt = require('bcrypt');

//Signup Api
authRouter.post("/signup",async(req,res)=>{
    try{   
       // validating data
       validateSignupData(req);
       const {firstName,lastName,emailId,age,skills,gender,password}=req.body
   
       // Encrypt the password
       const passwordHash=await bcrypt.hash(password,10);
   
       //creating a new instance of user Model
       const user=new User({
           firstName,
           lastName,
           emailId,
           password:passwordHash,
           gender,
           age,
           skills
       })
   
       await user.save()
       res.send("User added successfully")
   }
   catch(err){
       res.status(401).send(err.message )
   }
   
   })
   
   //login 
authRouter.post("/login",async(req,res)=>{
     try{
      const{emailId,password}=req.body
       const user=await User.findOne({emailId:emailId})
       if(!user)
       {
           throw new Error("something went wrong")
       }
      const isPasswordValid= await user.validatePassword(password)
   
      if(isPasswordValid){
       // Create a JWT token , 
       const token=await user.getJWT()
       
       //add the token to the cookie and send it back to the user
       
       res.cookie("token",token)
       res.send("login successful")
      }
      else{
       throw new Error ("something went wrong")
      }
       }
       catch(err){
           res.status(400).send("ERROR:"+err.message)
       }
   })

module.exports = authRouter