const express= require("express") 
const app = express()
const connectDB=require("./config/database") 
const cookieParseer=require("cookie-parser")
const cors=require("cors")

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
))
app.use(express.json())
app.use(cookieParseer())

const authRouter= require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")
const paymentRouter = require("./routes/payment")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)




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
