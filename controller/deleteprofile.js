const mongoose = require('mongoose');
const client = require('../redis/redis_connect')
const chamber = require('../model/chamber_schema');
const user = require('../model/users_schema');
const bcrypt=require('bcrypt')

async function deleteprofile(req,res){

  const usernameexist =await user.findOne({_id : req.userid,"status":"activated"},{"user_password":1})
  if(usernameexist){
    const validpassword =bcrypt.compareSync(req.body.user_password, await usernameexist.user_password)
    if(validpassword){
      user.aggregate([
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(req.userid)
          }
        }, {
          '$project': {
            'chamber_history': 1, 
            '_id': 0
          }
        }, {
          '$unwind': {
            'path': '$chamber_history'
          }
        }, {
          '$project': {
            'chamber_history.chamber_id': 1
          }
        }
      ]).then(doc=>{
          if(doc.length>0){
              var ids= [];
              let pushtoid= new Promise((resolve,reject)=>{
                  doc.forEach((x,i)=>{
                      ids.push(x.chamber_history.chamber_id)
                      if((i+1)===doc.length){resolve(ids)}
                  })
              })
              user.deleteOne({_id:req.userid}).then(data=>{
                pushtoid.then(datas=>{chamber.deleteMany({_id:{'$in':datas}}).then(data=>{return res.send({"success":"Deleted your profile successfully"})}).catch(err=>{return res.send({"error":"error deleting user"})})})
              }).catch(err=>{return res.send({"error":"error deleting user"})})
          }else{
            user.deleteOne({_id:req.userid}).then(data=>{
              return res.send({"success":"Deleted your profile successfully"})}).catch(err=>{return res.send({"error":"error deleting user"})})
          }
          client.srem('authuser',req.userid)
      })
    }else{
      return res.send({"error":"invalid password"})
    }
  }
}

module.exports={deleteprofile}