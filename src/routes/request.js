const express = require("express")
const requestRouter= express.Router()
const {userAuth}=require("../middlewares/auth");
const ConnectionRequest=require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

//Send connection request
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
 
    try{
       const fromUserId=req.user._id;
       const toUserId=req.params.toUserId;
       const status=req.params.status

     const allowedStatus=["ignored","interested"]
     if(!allowedStatus.includes(status))
     {
       return res.status(400).
        json({
            message:"invalid status type : " + status
        })
     }




     // checking if toUserId is valid or not
     const toUser=await User.findById(toUserId);
     if(!toUser)
     {
     return res.status(404).json({message:"User not found"})
     }

     //If there is an existing connection request
     // The $or operator here checks:
     // Whether a connection request already exists in the database in the forward direction.
     // Whether a connection request exists in the reverse direction.

     const existingConnectionRequest=await ConnectionRequest.findOne(
        {
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId , toUserId: fromUserId}
            ]
        })
        if(existingConnectionRequest)
        {
            // return res.status(400).json({message:"connection request already exist"})
            if (existingConnectionRequest.status === status) {
                return res.status(200).json({ message: "Status already set", data: existingConnectionRequest });
            }
            
            existingConnectionRequest.status = status;
            await existingConnectionRequest.save();
            
            return res.json({
                message: "Connection request status updated successfully",
                data: existingConnectionRequest,
            });
            
        }

       const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status
       })
       const data= await connectionRequest.save();

       try {
        const emailRes = await sendEmail.run();
        console.log("Email sent successfully:", emailRes);
        res.json({
          message: "Connection request sent successfully",
          data,
        });
      } catch (emailErr) {
        console.error("Error sending email:", emailErr.message);
      }

    //    res.json({
    //     message:"connection request sent successfully",
    //     data
    //    })
    }
    catch(err)
    {
        console.log(err)
    }
})
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user
        const{status,requestId}=req.params

        // Validate the status
        const allowedStatus=["accepted", "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).send({message:"Status not allowed !"})
        }
       

        const connectionRequest= await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser,
            status:"interested"
        })
        if(!connectionRequest)
        {
            return res.status(400).send({message:"connection request not found"})
        }
       
        connectionRequest.status=status; 
        const data = await connectionRequest.save()
        res.json({message:"connection request: "+ status ,data})
    
    }
    catch(err)
    {
        res.status(400).send("ERROR :" + err.essage)
    }
     

})

module.exports=requestRouter