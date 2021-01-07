/**
 * ---------------------------------------------------
 *  CONTROLLER FOR RESET PASSWORD RELATED OPERATIONS
 * ---------------------------------------------------
 */
const user = require('../model/users_schema')
const randomstring = require('randomstring')
const querystring=require('querystring')
const sendthemail=require('../helper/send_mail')
const bcrypt= require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()
/**
 * ---------------------------------------------------
 *         RESET PASSWORD REQUEST HANDLER
 * ---------------------------------------------------
 */
async function forgotpassword(req,res){
    const randstr = randomstring.generate()
    const savetodb = await user.findOneAndUpdate({"user_email":req.body.user_email,"status":'activated'},{
        "password_reset_key":randstr,"password_reset_key_expiry":Date.now()+1.8e+6
    },{useFindAndModify:false})
    if(savetodb){  
    const sent=await sendthemail(req.body.user_email,"password reset for Discuss junction", `The password reset link for your discuss junction account is ${process.env.baseurl}/api/resetpassword?&DJK=${randstr}&DJM=${req.body.user_email}`)
    if ((sent) === "sent") {
        return res.send({ "success": "activation key sent to your e-mail id" });
    }
    if ((sent) !== "sent") {
        return res.send({
        error: "error sending reset code, try again after sometime",
        });
    }
    }else{return res.send({
        error: "No such mail id found",
    });}
};
/**
 * ---------------------------------------------------
 *      PASSWORD RESET URL PARSE AND ACTIVATE
 * ---------------------------------------------------
 */
async function resetpassword(req,res){
    const randstr = randomstring.generate()
    const object = querystring.parse(req.url);
    const updatedb= await user.findOneAndUpdate({"user_email":object.DJM,password_reset_key_expiry:{'$gt':Date.now()}},{
        "password_reset_token":randstr,'$unset':{"password_reset_key":"","password_reset_key_expiry":""}
    },{useFindAndModify:false})
    if(updatedb){return res.redirect(`${process.env.frontendbaseurl}/setpassword?&token=${randstr}&user_mail=${object.DJM}`)}else{
        return res.redirect(`${process.env.frontendbaseurl}/activation?&error=error updating database or wrong passcode`);
    }
    
}

async function changeforgotpassword(req,res){
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.user_password, salt);
    const savetodb = await user.findOneAndUpdate({"user_email":req.body.user_email,"password_reset_token":req.body.token},{
        '$unset':{"password_reset_token":""},user_password:hashedpassword
    },{useFindAndModify:false})
    if(savetodb){
        return res.send({"success":"changed password successfully"})
    }else{
        return res.send({"error":"Error updating details"})
    }
}

async function changepassword(req,res){
    const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.new_password, salt)

    const usernameexist =await user.findOne({"_id" : req.userid,"status":"activated"},{
        "user_password":1
    });
    if(usernameexist){
        const validpassword = bcrypt.compareSync(req.body.old_password, await usernameexist.user_password)
        if(validpassword){
            const savetodb=await user.findOneAndUpdate({"_id" : req.userid},{
                "user_password":hashedpassword
            },{useFindAndModify:false})
            if(savetodb){
                return res.send({"success":"Changed password successfully"})
            }else{
                return res.send({"error":"error changing password"})
            }
        }
        if(!validpassword) return res.send({"error":'old password is incorrect'});
    }else{
        return res.send({"error":"Error cannot find user"})
    }
}

 module.exports={forgotpassword,resetpassword,changeforgotpassword,changepassword}