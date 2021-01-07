const mongoose = require('mongoose')

const chamber = new mongoose.Schema({
    created:{type:String},   /* Date of creation of chamber */
    created_by_userid:{type:String,required:true},   /* user-id of creator */
    created_by_name:{type:String,required:true},    /* user name of creator */
    scheduled_time:{type:String,required:true},  /* scheduled time for chamber starting */
    chamber_name:{type:String,lowercase:true,required:true},   /* Chamber name */
    chamber_description:{type:String,required:true}, /* description of the chamber */
    hashtags:[{type:String,lowercase:true}],   /* hastags for chamber */
    photo_url:{type:String}, /* display photo for chamber */
    photo_id:{type:String}, /* drive id for picture */
    discuss_history:[{
        comment:{type:String}
    }],
    active_user_count:{type:Number,default:0} /* number of active users in chamber */
})
chamber.index({ chamber_name: 'text', chamber_description: 'text', hashtags: 'text'}, {name: 'myindex', weights: {chamber_name: 5, hashtags: 3, chamber_description: 1}});
module.exports= mongoose.model('chamber',chamber)