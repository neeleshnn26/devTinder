const express= require("express") 
const app = express()
const connectDB=require("./config/database") 
const User=require("./models/user")
app.use(express.json())

app.post("/signup",async(req,res)=>{
    //creating a new instance of user Model
    const user=new User(req.body)
try{
    await user.save()
    res.send("User added successfully")
}
catch(err){
    res.status(401).send(err.message )
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
app.patch("/patch",async(req,res)=>{
    const userId=req.body.userId
    const data=req.body
  try{
    const updatedUser= await User.findByIdAndUpdate(userId,data,{returnDocument:'after' , runValidators:true})
   res.send("user updated successfully")
  }
  catch(err)
  {
    res.status(400).send("Update failed"+ err.message)
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
