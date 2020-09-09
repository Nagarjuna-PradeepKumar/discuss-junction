/*
-----------------------------------------------
|              CONTROLLER FOR LOGIN
-----------------------------------------------
*/
const user = require('../model/users_schema')
const jwt =require('jsonwebtoken')
const dotenv=require('dotenv')
const bcrypt=require('bcrypt')
const client = require('../redis/redis_connect')
dotenv.config()
/*
-----------------------------------------------
|           FUNCTION FOR LOGIN
-----------------------------------------------
*/
async function login(req,res){
    const usernameexist =await user.findOne({"user_email" : req.body.user_email,"status":"activated"},{"user_password":1,"user_email":1,"user_name":1})
    if(usernameexist){
        const validpassword =await bcrypt.compareSync(req.body.user_password, await usernameexist.user_password)
        if(await validpassword){
            const token = jwt.sign(
                { DJID: usernameexist._id, DJ_email: usernameexist.user_email,DJ_name:usernameexist.user_name },
                process.env.jwt_secret
              );
            return res.send({"success":token,"user_id":usernameexist._id,"user_name":usernameexist.user_name})
        }else{
            return res.send({"error":"Incorrect password"})
        }
    }else{
        return res.send({"error":"Could not find the user"})
    }
}
async function verify(req,res,next){
    try{
        const token=await req.body.token
        const payload=jwt.verify(await token,process.env.jwt_secret)
        const userdata =await user.findOne({"_id":await payload.DJID,"user_email":await payload.DJ_email,"status":"activated"});
        if(userdata){
            client.sadd("authuser",await payload.DJID,async function(err,reply){
                return res.send({"success":"authorised user","user_id":await payload.DJID,"email":payload.DJ_email,"image":userdata.user_picture ? userdata.user_picture:null,"user_name":userdata.user_name,"user_gender":userdata.user_gender?userdata.user_gender:null })
            })
        }
        else{return res.send({"error":"authentication error"})}     
    }catch(err){return res.send({"error":"invalid token"})}
 }
module.exports={login,verify}