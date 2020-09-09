const chamber = require("../model/chamber_schema");


async function upload_chamber_pic(req, res) {
    const savetochamber= await chamber.findOneAndUpdate({"_id":req.body.chamber_id,"created_by_userid":req.userid},{
        "photo_url":req.body.file
    },{useFindAndModify:false})
    if(savetochamber){
        return res.send({"success":"Updated chamber picture successfully"})}else{
        return res.send({"error":"Error updating chamber picture"})}
}
async function delete_chamber_pic(req, res) {
    const pictureid = await chamber.findOneAndUpdate({"_id":req.body.chamber_id,"created_by_userid":req.userid},{'$unset':{"photo_url":""}},{useFindAndModify:false,new:true})
    if(pictureid){return ({"success":"Successfully deleted chamber's picture"})}else{return ({"error":"Error deleting from database"})}
}

async function change_chamber_pic(req,res){
    const savetochamber= await chamber.findOneAndUpdate({"_id":req.body.chamber_id,"created_by_userid":req.userid},{
        "photo_url":req.body.file
    },{useFindAndModify:false})
    if(savetochamber){
        return res.send({"success":"Updated chamber picture successfully"})}else{
        return res.send({"error":"Error updating chamber picture"})}
}
module.exports = { upload_chamber_pic,delete_chamber_pic,change_chamber_pic };


// success.data.thumbnailLink
// file.data.id,