const express=require("express")
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest=require("../models/connectionRequest");
const User = require("../models/user");
const userRouter=express.Router()

//Get all the pendig connection request for loggedIn user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{

try{
    const loggedInUser=req.user
    const connectionRequest= await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status: "interested"
     }).populate("fromUserId" ,["firstName","lastName","skills"])

    res.json({
        message:"data fetched successfully", 
        data:connectionRequest
    })

}   
catch(err) 
{
    res.status(400).send("ERROR: " + err.message)
} 

})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
       const loggedInUser=req.user

       const connectionRequest= await ConnectionRequest.find({
           $or:[
            {toUserId:loggedInUser ,status:"accepted"},
            {fromUserId:loggedInUser,status:"accepted"}
           ]
       })
       .populate("fromUserId" ,["firstName","lastName"])
       .populate("toUserId" ,["firstName","lastName"])

       const data = connectionRequest.map((row)=>{
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId
        }
        return row.fromUserId
       }) 

       res.json({data})
    }
    catch(err)
    {
       res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
 try{
        // User should see all the user cards except
        // 0. His own card
        // 1. his connections
        // 2. ignored people
        // 3. already sent or received the connection request
        const loggedInUser= req.user
        const page= parseInt(req.query.page) || 1
        let limit= parseInt(req.query.limit) ||10
        limit=limit>50 ?50 :limit
        const skip=(page-1)*limit
       // Find all the connection request sent or received
       const connectionRequest= await ConnectionRequest.find({
        $or:
        [
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
       }).select("fromUserId toUserId")
       
        const hideUserFromFeed=new Set();
        connectionRequest.forEach((req)=>{
            hideUserFromFeed.add(req.fromUserId.toString())
            hideUserFromFeed.add(req.toUserId.toString())
        })
        const users= await User.find({
            $and:
            [
              {_id:{$nin:Array.from(hideUserFromFeed)}},
              {_id:{$ne:loggedInUser._id}}
            ] })
            .select("firstName lastName skills")
            .skip(skip )
            .limt(limit)
             
       
       res.josn({data:users})
    }
    catch(err)
    {
        res.status(400).send("ERROR :" + err.message)
    }
})
module.exports=userRouter