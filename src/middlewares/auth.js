const jwt=require("jsonwebtoken")
const User=require("../models/user")

const userAuth=async(req,res,next)=>{
    // Read the token from req.cookies
  try{
    const cookies=req.cookies
    const{token}=cookies
    if(!token)
    {
        return res.status(401).send("Please Login")
    }
    const decodedMessage= await jwt.verify(token,process.env.JWT_SECRET)
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