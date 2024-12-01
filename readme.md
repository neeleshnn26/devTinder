## Starting of an project
- First we started with npm init , it gives us package.json file , this files gives us details about project and its dependncies.
- Start making by src folder , and app.js file inside it , which will act as starting file of our project.
- Now we will create a server using express.js , start by installing express by , npm i express. And we will get node modules and     package-lock.json file. and dependency is created in package.json.package-lock.json contain lock version of dependency or the updated version or latest version of dependency
- const express= require("express")
  const app = express()
  app.use("/test",(req,res)=>{
    res.send("this is /test route")
  })
  app.listen(3000,()=>{
    console.log("listening on the port 3000")
  })
- app.use will match all HTTP method API calls to /test . mtlb ye /test get, post,patch ,delete sbme kaam krega postman me.

## Routing and request handlers
- Initializing git repository.
- Note:Order of the routes matter , it means the way routes have been ordered in file matters.
- Tyes of http methods : GET,POST,PATCH,DELETE , they are also known as CRUD operations.
- If we dont write any http method , then by default it takes GET method.
- Downloading Postman to test API.
- Advanced routing
   eg: const express= require("express")
const app = express()
app.get("/ab?c",(req,res)=>{
    // this shows that putting "b" on the route is optional.
    res.send("this is /user route")
})
app.get("/ab+c",(req,res)=>{
    // this shows that "a" and "c" should be at end , and we can put as many "b" we want
    res.send("this is /user route")
})
app.get("/ab*cd",(req,res)=>{
    // this shows that route starts with "ab" and ends with "cd" and we can put anything in the middle of ab and cd .
    res.send("this is /user route")
})
app.get("/a(bc)?c",(req,res)=>{
    // this shows that putting "bc" on the route is optional.
    res.send("this is /user route")
})
app.get("/a(bc)?c",(req,res)=>{
    // this shows that putting "bc" on the route is optional.
    res.send("this is /user route")
})
app.listen(3000,()=>{
    console.log("listening on the port 3000")
})

## Middleware and error handlers
- created  middleware folder inside src
- learning about multiple route handlers .
   eg: app.use("/route", RH1,RH2,RH3)
- Difference between app.use and app.all.(app.use can also be used for subroutes , for example /admin/subroute , but app.all can be used only for exact route and not for subroute)
- Learnt about middlewares and its uses , basically middlewares are used for doing authentication and other stuff which are done before moving on to the routes.
- Middlewares are of great use as we dont have to write auth in each route , we can simply provide auth to middlewares and then it will handle everything.
- ERROR HANDLING : For error handlling always use try and catch in the code, but apart from this at the end of code we can also handle error by , 
 eg: app.use("/",(req,res)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
 })

 ## Database , Schema and models
- create config folder inside src and create database.js file.
- Install mongoose and get connected to database.
- created a userSchema by mongoose.Schema and userModel by mongoose.model("modelName",schemaName).
- added few users to database , in user model.
eg: app.post("/signup",async(req,res)=>{
    //creating a new instance of user Model
    const user=new User({
        firstName:"neelesh",
        lastName:"nainwal",
        emailId:"neelesh@gmail.com",
        password:"neelesh@123"
})
try{
    await user.save()
    res.send("User added successfully")
}
catch(err){
    res.status(401).send("something went wrong")
}

})

## Diving into the APIs
- what is the difference between JS object and JSON ?
- Using middleware express.JSON to onvert JSON object to javascript object , because the data will come in json format and it ahs to be converted into javascript object.
- created two get APIs , "/user" to get user data based on emailId, and "/feed" to get data of all the users , used findOne ,findById,find
- eg:
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
- Difference between patch and put.
- Deleting user by findByIdAndDelete.
- updating user bt , findByIdAndUpdate(id, update, options) 
- what are options ?
- eg: app.patch("/patch",async(req,res)=>{
    const userId=req.body.userId
    const data=req.body
   const updatedUser= await User.findByIdAndUpdate(userId,data,{returnDocument:'before'})
    if(!updatedUser){
        res.status(400).send("something went wrong")
    }
    else{
        res.send(updatedUser)
    }
})

## Data sanitization and schema validations
- 