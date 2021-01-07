/*
-----------------------------------------------
|    CONTROLLER FOR GETTING USER DETAILS
-----------------------------------------------
*/
const user = require('../model/users_schema')
const detail=require('../helper/user_details_aggregation')
const jwt =require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()

/*
-----------------------------------------------
|   FUNCTION FOR GETTING USER ALL DETAILS 
-----------------------------------------------
*/

async function getuserdetails(req,res){
    let result={
        userdetails:{},
        created_chambers:[],
        joined_chambers:[],
    }
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        const payload=jwt.verify(await token,process.env.jwt_secret)
        const userdata =await user.findOne({"_id":await payload.DJID,"user_email":await payload.DJ_email,"status":"activated"},{
            "status":0,
            "user_password":0,
            "activation_key":0,
            "password_reset_key":0,
            "password_reset_token":0,
            "activation_time":0,
            "password_reset_key_expiry":0});
        if(userdata){
            result.userdetails=userdata;
            const create = await detail.get_created_details({userid:payload.DJID,page_number:req.body.created_details_pageno,items_per_page:req.body.created_details_items_per_page});
            if(await create.success){result.created_chambers=create.success};
            const join= await detail.get_joined_details({userid:payload.DJID,page_number:req.body.joined_details_pageno,items_per_page:req.body.joined_details_items_per_page});
            if(await join.success){result.joined_chambers=join.success}
            return res.send({"success":result})
  
        }
        else{return res.send({"error":"No such user"})}     
    }catch(err){return res.send({"error":"invalid token"})}
}

async function getcreatedchamberdetail(req,res){
    const create = await detail.get_created_details({userid:req.userid,page_number:req.body.created_details_pageno,items_per_page:req.body.created_details_items_per_page});
        if(await create.success){return res.send({"success":create.success})}
        if(await create.error){return res.send({"error":"error retriving details"})}
}

async function getjoinedchamberdetail(req,res){
    const join= await detail.get_joined_details({userid:req.userid,page_number:req.body.joined_details_pageno,items_per_page:req.body.joined_details_items_per_page});
        if(await join.success){return res.send({"success":join.success})}
        if(await join.error){return res.send({"error":"error retriving details"})}
}

module.exports={getuserdetails,getcreatedchamberdetail,getjoinedchamberdetail}