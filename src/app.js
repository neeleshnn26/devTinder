const express= require("express")
const app = express()
app.use("/",(req,res)=>{
    res.send("this is / route")
})
app.listen(3000,()=>{
    console.log("listening on the port 3000")
})