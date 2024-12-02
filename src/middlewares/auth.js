const jwt=require("jsonwebtoken")
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
    // Read the token from req.cookies
  try{
    const cookies=req.cookies
    const{token}=cookies
    if(!token)
    {
        throw new Error("something went wrong")
    }
    const decodedMessage= await jwt.verify(token,"DEV@Tinder$790")
    const{_id}=decodedMessage
    const user = await User.findOne({_id})
    if(!user)
    {
        throw new Error('User not found')
    }
    req.user=user
    next()
  }  
  catch(err)
  {
    res.status(401).send("ERROR:"+ err.message)
  }
}
module.exports={
    userAuth
}