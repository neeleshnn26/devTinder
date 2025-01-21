const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


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
    trim:true,
    validate(value){
        if(!validator.isEmail(value)){
         throw new Error ("Invalid Email address"+ value)
        }
    }
  },
  password:{
    type:String ,
    required:true,
    validate(value){
        if(!validator.isStrongPassword(value)){
         throw new Error ("Enter strong password : "+ value)
        }
    }
    
  },
  age:{
    type:Number,
    min:18
  },
  gender:{
    type:String,
    enum:{
      values:["male","female","others"],
      message:`{VALUE} is not a valid gender type`
    },
  },

  photoUrl:{
    type:String,
    validate(value){
        if(!validator.isURL(value)){
         throw new Error ("Invalid photo URL"+ value)
        }
    },
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
  },
  
  skills:{
    type:[String],
    validate: {
        validator: function (skills) {
          // Ensure the array has exactly 4 strings
          return skills.length <= 4;
        },
        message: 'The skills array must contain  4 items.',
      },
 },
 about:{
  type:String,
  default:"This is default about of user"
}
},{timestamps:true})

userSchema.methods.getJWT=async function(){
    const user=this
    const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"})
    return token
}

userSchema.methods.validatePassword=async function(passwordInputByUser)
{
    const user=this;
    const passwordHash=user.password
    const isPasswordValid= await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    )
    return isPasswordValid ;
}
const User = mongoose.model("User",userSchema)
module.exports =User