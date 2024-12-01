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
    res.status(401).send("something went wrong")
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
