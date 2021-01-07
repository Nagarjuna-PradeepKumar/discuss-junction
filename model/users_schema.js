const mongoose = require('mongoose')

const user = new mongoose.Schema({
    status:{type:String,required:true,default:"notactivated"}, /* activated or notactivated or deleted */
    user_name:{type:String,required:true}, /* name of the user */
    user_birthday:{type:Number}, /* birthdate of the user in epoch */
    user_gender:{type:String}, /* gender of the user */
    user_email:{type:String,lowercase:true,required:true}, /* emailid of the user */
    user_password:{type:String,required:true}, /* password of user */
    user_pic_id:{type:String,}, /* Id of user picture in google drive */
    user_picture:{type:String}, /* location of Profile picture of user */
    about:{type:String}, /* About the user */
    interests:[{type:String}], /* interest of the user */
    activation_key:{type:String}, /* Account activation key */
    password_reset_key:{type:String}, /* Password reset key */
    password_reset_token:{type:String}, /* Password reset after confirmation from mail */
    activation_time:{type:Number}, /* Expiry time of activation key */
    password_reset_key_expiry:{type:Number}, /* Password reset key expiry  */
    chamber_history:[{
        _id:false,
        date:{type:String}, /* date of creation of chamber */
        chamber_id:{type:String}, /* unique id for chamber */
    }],
    joined_chambers:[{
        _id:false,
        chamber_id:{type:String}, /* unique id for chamber */
        date:{type:String}, /* date of creation of chamber */
    }]
})

module.exports= mongoose.model('user',user)