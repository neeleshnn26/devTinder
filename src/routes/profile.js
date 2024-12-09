const express = require("express")
const profileRouter= express.Router()
const {userAuth}=require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")

// Profile api
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
    const user=req.user
    res.json(user)
    }
    catch(err)
    {
        res.status(400).send("something went wrong")
    }
   
})
 
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
   try{
       if(!validateEditProfileData(req))
       {
        throw new Error("Invalid edit request")
       }
       const loggedInUser=req.user
       Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))

       await loggedInUser.save()

       res.json({
        message:`${loggedInUser.firstName}, your profile updated successfully`,
        data:loggedInUser
       })
   }
   catch(err){
    res.status(400).send("ERROR :" + err.message)
   }
})

module.exports=profileRouter