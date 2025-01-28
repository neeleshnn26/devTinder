// const cron=require("node-cron") 
// const {subDays, startOfDay}=require("date-fns")
// const connectionRequestModel = require("../models/connectionRequest")
// const { set } = require("mongoose")

// // this job will run in 8 am in the morning everyday.
// cron.schedule("* 8 * * * *",async ()=>{
//     try{
//    const yesterday=subDays(new Date(),1)    
//    const yesterdayStart=startOfDay(yesterday)
//    const yesterdayEnd=endOfDay(yesterday)
//     const pendingRequests=await  connectionRequestModel.find({  
//      status:"interested",
//      createdAt:{
//           $gte:yesterdayStart,
//           $lt:yesterdayEnd
//      }
//     }).populate("fromUserId toUserId")

//     const listofEmail= [... new set(pendingRequests.map(req=>req.toUserId.emailId))]

//     for(const email of listofEmail)
// }

//     catch(err)
//     {
//         console.log("ERROR:"+err.message)
//     }
// })
