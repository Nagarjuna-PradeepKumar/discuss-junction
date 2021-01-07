/**
 * ----------------------------------------------
 *  CONTROLLER FOR CHAMBER RELATED OPERATIONS
 * ---------------------------------------------
 */
const chamber = require('../model/chamber_schema')
const user = require('../model/users_schema')
const picture = require('../helper/b64_chamber_picture')

/**
 * ----------------------------------------------
 *              CREATE CHAMBER
 * ---------------------------------------------
 */
async function createchamber(req,res){
    const newchamber = new chamber({
        created:Date.now(),
        created_by_userid:req.userid,
        created_by_name:req.username,
        scheduled_time:req.body.scheduled_time,
        chamber_name:req.body.chamber_name,
        chamber_description:req.body.chamber_description,
        hashtags:req.body.hashtags
    })
    const created =await newchamber.save();
    if(created){
        const savetouser = await user.findOneAndUpdate({"_id":req.userid,"status":"activated"},{
            '$push':{"chamber_history":{
                "date":await created.created,
                "chamber_id":await created._id,

            }}
        },{useFindAndModify:false})
        if(savetouser){return res.send({"success":created._id})}else{
            return res.send({"error":"error saving to database"})
        }
    }
 }
 /**
 * ----------------------------------------------
 *             UPLOAD CHAMBER PICTURE
 * ---------------------------------------------
 */
async function uploadchamberpicture(req,res){
    picture.upload_chamber_pic(req,res)
 }

 /**
 * ----------------------------------------------
 *             DELETE CHAMBER PICTURE
 * ---------------------------------------------
 */
 async function deletechamberpicture(req,res){
    const deleted = await picture.delete_chamber_pic(req,res)
    if(deleted.success){
        return res.send({"success":"Deleted your profile picture successfully"})}
    else{return res.send({"error":"Error deleting profile picture"})}
 }
 /**
 * ----------------------------------------------
 *          CHANGE CHAMBER PICTURE
 * ---------------------------------------------
 */
 async function changechamberpicture(req,res){
    picture.change_chamber_pic(req,res)
}
/**
 * ----------------------------------------------
 *          CHANGE CHAMBER DETAILS
 * ---------------------------------------------
 */
 async function changechamberdetails(req,res){
    const update =await chamber.findOneAndUpdate({"_id":req.body.chamber_id,"created_by_userid":req.userid},{
        '$set':{
            "scheduled_time":req.body.scheduled_time,
            "chamber_name":req.body.chamber_name,
            "chamber_description":req.body.chamber_description,
            "hashtags":req.body.hashtags
        }
    },{useFindAndModify:false,new:true})
    if(await update){
        return res.send({"success":"Successfully updated chamber details"})
    }else{return res.send({"error":"Error updating details"})}
 }
/**
 * ----------------------------------------------
 *               DELETE CHAMBER
 * ---------------------------------------------
 */
async function deletechamber(req,res){
    const deletefromchamber = await chamber.findOneAndDelete({"_id":req.body.chamber_id,"created_by_userid":req.userid},{useFindAndModify:false})
    if(deletefromchamber){
        const deletefromuser = await user.findOneAndUpdate({"_id":req.userid},{
            '$pull':{"chamber_history":{"chamber_id":req.body.chamber_id}}
        },{useFindAndModify:false})
        if(deletefromuser){return res.send({"success":"Successfully deleted chamber"})}else{
            return res.send({"error":"Error deleting in userdatabase"})
        }
    }else{return res.send({"error":"Error deleting in userdatabase"})}
}
 module.exports={createchamber,uploadchamberpicture,deletechamberpicture,changechamberpicture,changechamberdetails,deletechamber}
