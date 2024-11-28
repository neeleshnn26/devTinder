const adminAuth=(req,res,next)=>{
    const token = "xyz"
    const isTokenValid=token==="xyz"
    if(!isTokenValid){
       res.status(401).send("something went wrong")
    }
    else{
       next()
    }
}
module.exports={
    adminAuth
}