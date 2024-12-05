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
- Fields for data sanitization on schema: required , unique , default , lowercase(to keep the data same for everyone ),trim,minLength, custom validator .
- We can create timstamps at schema , {timestamps:true} , this will give when the user was created and was it updated.
- API level validation , like you cant update your email and userId will be retrived from URL.
- Adding validation on to the skills field.
- We can use validator library from , npm validator (npm i validator) to validate emailId , photURL , strongPasswordetc.
- We can use this validator for both schema level as well as for API level .

## Encrypting password
- validating the user before signing up.
- we will use npm package "bcrypt" to encrypt the password.
- eg: const passwordHash=await bcrypt.hash(password,10).
- created login API
  eg: app.post("/login",async(req,res)=>{
  try{
   const{emailId,password}=req.body
    const user=await User.findOne({emailId:emailId})
    if(!user)
    {
        throw new Error("Email id is not valid")
    }
   const isPasswordValid= await bcrypt.compare(password,user.password)
   if(isPasswordValid){
    res.send("login successful")
   }
   else{
    throw new Error ("password is not correct")
   }
    }
    catch(err){
        res.status(400).send("ERROR:"+err.message)
    }
})

## Authentication , JWT and cookies
- Whenever we login with email and password the server will validate the user based on its email and password , and once the user is validated it creates the JWT token and wrap that JWT(json web token) token inside the Cookie.This cookie is unique for every user , so when we make a login call to server it will send us a cookie and it will be stored by the browser, and whenever we make another api call to the server then our cookie will travel along to the server and it  will be validated and response will be sent by the server if the cookie is validated.
- we use npm library jsonwebtoken to create a token
- We can also set expiry date of the cookie , so when the cookie is expired it wil not work.
- to read the cookie we need middleware known as cookie parser.
- so what we have done is , phele humne login k time pe jwt token create kra hai , aur usk baad vo token browser me store ho jaaega , aur jb hum other APIs ko access krenge to hume uss token se validate kia jaaega , agr vo token valid hoga tbhi hume details milegi vrna error aa jaaega. us token k andar humne userId send kri hogi aur jb hum uss token ko decode kreneg secret key dekr to usk baad hum uss token me se userId retrieve kr lege aur uss userId k basis pr hum apne user ka data nikaal lenge.
- we can also expire our cookie and token.
- created sendConnectionRequest API.

## Diving nto the APIs and express router
- authRouter
a. POST/signup
b. POST/login
c. POST/logout

- profileRouter
a. GET/profile/view
b. PATCH/profile/edit
c. PATCH/profile/password

- connectionRequestRouter
a. POST/request/send/interested/:userId
b. POST/request/send/ignored/:userId
c. POST/request/review/accepted/:requestId
d. POST/request/review/rejected/:requestId

- userRouter
a. GET/user/connections
b. GET/user/requests
c. GET/user/feed - Gets you the profile of other users on platform


