const mongoose=require('mongoose')

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", // reference to user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:
        {values:["ignored","interested","accepted","rejected"],
        message:`{VALUE} is incorrect status type`
        },
    },
   },
{
    timestamps:true
} 
)


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });



// This .pre act as middleware , which runs before the data the saved to the database
connectionRequestSchema.pre("save" , function(next)
{
    const connectionRequest=this;
    // Check if from userid is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId ))
    {
        throw new Error("cananot send request to the same user Id")
    }
    next()
}) 

const connectionRequestModel=new mongoose.model(
    "connectionRequest",
    connectionRequestSchema
)
module.exports=connectionRequestModel