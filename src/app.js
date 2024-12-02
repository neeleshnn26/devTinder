const express= require("express") 
const app = express()
const connectDB=require("./config/database") 
const User=require("./models/user")
const {validateSignupData}=require("./utils/validation")
const bcrypt = require('bcrypt');
const cookieParseer=require("cookie-parser")
const jwt=require("jsonwebtoken")
const {userAuth}=require("./middlewares/auth")

app.use(express.json())
app.use(cookieParseer())


//Signup Api
app.post("/signup",async(req,res)=>{
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
app.post("/login",async(req,res)=>{
  try{
   const{emailId,password}=req.body
    const user=await User.findOne({emailId:emailId})
    if(!user)
    {
        throw new Error("something went wrong")
    }
   const isPasswordValid= await bcrypt.compare(password,user.password)

   if(isPasswordValid){
    // Create a JWT token , 
    const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"})
    
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

// Profile api
app.get("/profile",userAuth,async(req,res)=>{
    try{
    const user=req.user
    res.send(user)
    }
    catch(err)
    {
        res.status(400).send("something went wrong")
    }
   
})

//Send connection request
app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user=req.user

   res.send(user.firstName +": sent the connection request")
})





connectDB()
.then(()=>{
    console.log("Database connected successfully"),
    app.listen(3000,()=>{
        console.log("listening on the port 3000")
    })
})
.catch((err)=>{
    console.log("Database cant be connected")
})
