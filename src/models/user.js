const mongoose=require("mongoose")
const userSchema= mongoose.Schema({
  firstName:{
      type:String,
      required:true,
      minLength:3 
  },
  lastName:{
    type:String 
  },
  emailId:{
    type:String ,
    lowercase:true,
    required:true ,
    unique:true,
    trim:true
  },
  password:{
    type:String ,
    required:true
  },
  age:{
    type:Number,
    min:18
  },
  gender:{
    type:String,
    validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error ("Gender data is not valid ")
        }
    }
  },
  photoUrl:{
    type:String
  },
  skills:{
    type:[String],
 },
 about:{
  type:String,
  default:"This is default about of user"
}
},{timestamps:true})

const User = mongoose.model("User",userSchema)
module.exports =User