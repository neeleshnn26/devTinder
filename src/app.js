const express= require("express") 
const app = express()
const connectDB=require("./config/database") 
const User=require("./models/user")
const {validateSignupData}=require("./utils/validation")
const bcrypt = require('bcrypt');
const cookieParseer=require("cookie-parser")
const jwt=require("jsonwebtoken")

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
    const token=await jwt.sign({_id:user._id},"DEV@Tnder$790")
    console.log(token)
    
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
app.get("/profile",async(req,res)=>{
    try{
        const cookies = req.cookies;
    const{token}=cookies
    if(!token){
        throw new Error("something went wrong")
    }
    //Validate my token
    const decodedMessage= await jwt.verify(token,"DEV@Tnder$790")
    const{_id}=decodedMessage
    const user = await User.findById(_id)
    if(!user)
    {
        throw new Error("something went wrong ")
    }
    res.send(user)
    }
    catch(err)
    {
        res.status(400).send("something went wrong")
    }
   
})
//GET user by email
app.get("/user",async(req,res)=>{
    const email=req.body.emailId
    const user = await User.findOne({emailId:email})
    if(!user){
        res.status(400).send("something went wrong")
    }
    else{
        res.send(user)
    }
   
})

// FEED API -GET / feed - get all the users from database
app.get("/feed",async(req,res)=>{
   const user = await User.find({})
   if(!user){
     res.status(400).send("something went wrong")
   }
   else{
    res.send(user)
   }
 
})

// Delete user Api
app.delete("/delete",async(req,res)=>{
    const id = req.body.userId
    const dUser=await User.findByIdAndDelete(id)
    if(!dUser)
    {
        res.status(400).send("something went wrong")
    }
    else{
        res.send("user deleted successfully")
    }

})
//Update data of the user
app.patch("/patch/:userId",async(req,res)=>{
    const userId=req.params?.userId
    const data=req.body



  try{

    const ALLOWED_UPDATES=["userId","photoUrl","skills","age","gender","about"]
    const isUpdateAllowed=Object.keys(data).
    every((k)=>ALLOWED_UPDATES.includes(k)
   )
   if(!isUpdateAllowed)
   {
    throw new Error("Update not allowed")
   }
   
    const updatedUser= await User.findByIdAndUpdate(userId,data,{returnDocument:'after' , runValidators:true})
   res.send("user updated successfully")
  }
  catch(err)
  {
    res.status(400).send(err.message)
  }
   
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
