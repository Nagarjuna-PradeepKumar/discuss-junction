const user=require('../model/users_schema')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv');
const client = require('../redis/redis_connect')
dotenv.config();
async function jwtparser(req,res,next){
    try{
        const token=await req.get('Authorization').replace("Bearer ","")
        const payload=jwt.verify(await token,process.env.jwt_secret)
            client.sismember("authuser",payload.DJID,async function(err,reply){
                if(reply===1){console.log("redis served");req.userid=await payload.DJID;req.username=await payload.DJ_name;next()}else{
                    const userdata =await user.findOne({"_id":await payload.DJID,"user_email":await payload.DJ_email});
                    if(userdata&&await userdata.status==="activated"){
                        console.log("mongo served")
                        client.sadd("authuser",await payload.DJID,async function(err,reply){
                            req.userid=await payload.DJID;req.username=await payload.DJ_name
                            next()
                        })
                    }
                    else{return res.send({"error":"authentication error"})}
                }
            })
    }
    catch(err){return res.send({"error":"invalid token"})}
 }
 
 module.exports =jwtparser