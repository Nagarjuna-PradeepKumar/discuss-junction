const user = require("../model/users_schema");
const dotenv = require("dotenv");
dotenv.config();

async function upload_dp_pic(req, res) {
    const upload = await user.findOneAndUpdate({"_id":req.userid,"status":"activated"},{
        "user_picture":req.body.file
    },{useFindAndModify:false})
    if (upload){
        return res.send({success: "Profile picture uploaded successfully"})
    }else{return res.send({ "error": "Error updating to database" });}
}

async function delete_dp_pic(req, res) {
    const deleted = await user.findOneAndUpdate({"_id":req.userid,"status":"activated"},{
        '$unset':{"user_picture":""}
    },{useFindAndModify:false})
    if (deleted){
        return res.send({success: "Profile picture deleted successfully"})
    }else{return res.send({ "error": "Error updating to database" });}
}

async function change_dp_pic(req, res) {
    const upload = await user.findOneAndUpdate({"_id":req.userid,"status":"activated"},{
        "user_picture":req.body.file
    },{useFindAndModify:false})
    if (upload){
        return res.send({success: "Profile picture uploaded successfully"})
    }else{return res.send({ "error": "Error updating to database" });}
}

module.exports = { upload_dp_pic, delete_dp_pic, change_dp_pic };
