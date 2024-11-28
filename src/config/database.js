const mongoose=require("mongoose")

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://project:xELpq2qF0KTfmCrJ@project.5rs48.mongodb.net/devTinder")
}
module.exports=connectDB



