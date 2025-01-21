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
       const {firstName,lastName,emailId,age,skills,gender,password,photoUrl,about}=req.body
   
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
           skills,
           photoUrl,
           about
       })
   
      const savedUser= await user.save()

      const token=await savedUser.getJWT()
       
       res.cookie("token",token)

       res.json({message:"user added successfully",data:savedUser})

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
       res.send(user)
      }
      else{
       throw new Error ("Email or password is incorrect")
      }
       }
       catch(err){
           res.status(400).send("ERROR:"+err.message)
       }
   })

authRouter.post("/logout",async(req,res)=>
{
res.cookie("token",null,{
 expires:new Date(Date.now())
});
res.send("logout successful")
})

module.exports = authRouter