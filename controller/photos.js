/*
-----------------------------------------------
|  CONTROLLER FOR CHANGING DELETING OF PHOTOS
-----------------------------------------------
*/
const user= require('../model/users_schema')
const profilepicture = require("../helper/b64_profile_picture");
/*
-----------------------------------------------
|   DELETE USER'S PROFILE PICTURE
-----------------------------------------------
*/
async function deleteprofilephoto(req,res){
    const deleted = await profilepicture.delete_dp_pic(req,res);
    if(deleted.success){
        return res.send({"success":"Deleted your profile picture successfully"})}
    else{return res.send({"error":"Error deleting profile picture"})}
}
/*
-----------------------------------------------
|   CHANGE USER'S PROFILE PICTURE
-----------------------------------------------
*/
async function changeprofilephoto(req,res){
    profilepicture.change_dp_pic(req,res)
}
module.exports={deleteprofilephoto,changeprofilephoto}