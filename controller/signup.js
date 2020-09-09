/*
-----------------------------------------------
|       CONTROLLER FOR SIGNUP OF USER
-----------------------------------------------
*/

const user = require("../model/users_schema");
const mongoose=require('mongoose');
const bcrypt = require("bcrypt");
const querystring = require("querystring");
const randomstring = require("randomstring");
const sendthemail = require("../helper/send_mail");
const profilepicture = require("../helper/b64_profile_picture");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
/*
-----------------------------------------------
| FUNCTION FOR CREATING PROFILE BEFORE ACTIVATION
-----------------------------------------------
*/
async function createbaseprofile(req, res) {
  //check for existing email
  const usernameexist = await user.findOne({ user_email: req.body.user_email });
  if (usernameexist) return res.send({ error: "This email already exist" });

  //hash the passsword
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(req.body.user_password, salt);

  //generating random string
  const key = randomstring.generate();

  //get and assign data in user
  const saveuser = new user({
    user_name: req.body.user_name,
    user_email:req.body.user_email,
    user_password: hashedpassword,
    activation_key: key,
  });
  // send to database
  if (!usernameexist) {
    const savedUser = await saveuser.save();
    if (savedUser) {
      const sent = await sendthemail(
        await savedUser.user_email,
        "Discuss Junction activation key",
        `the activation key to your Discuss Junction account is ${
          process.env.baseurl
        }/api/activation?&DJK=${key}&DJI=${await savedUser._id}`
      );
      if ((await sent) === "sent") {
        console.log("sent");
        return res.send({ success: "activation key sent to your e-mail id" });
      }
      if ((await sent) !== "sent") {
        console.log(savedUser._id)
        user.findByIdAndDelete({_id:savedUser._id}).catch()
        console.log("notsent");
        return res.send({
          error: "error sending activation code, try again after sometime",
        });
      }
    } else {
      return res.send({ error: "error updating to database" });
    }
  }
}
/*
-----------------------------------------------
| FUNCTION FOR RESENDING ACTIVATION
-----------------------------------------------
*/
async function resendactivation (req,res){
  const key = randomstring.generate();
  const findindb =await user.findOne({user_email:req.body.user_email,status:"notactivated"})
  if(findindb){
    const savetodb= await user.findOneAndUpdate({user_email:req.body.user_email,status:"notactivated"},{activation_key:key},{useFindAndModify:false,new:true})
    if(savetodb){
      const sent = await sendthemail(
        await savetodb.user_email,
        "Discuss Junction activation key",
        `the activation key to your Discuss Junction account is ${
          process.env.baseurl
        }/api/activation?&DJK=${key}&DJI=${await savetodb._id}`
      );
      if ((await sent) === "sent") {
        console.log("sent");
        return res.send({ success: "activation key sent to your e-mail id" });
      }
      if ((await sent) !== "sent") {
        console.log("notsent");
        return res.send({
          error: "error sending activation code, try again after sometime",
        });
      }
    }else {return res.send({ error: "error updating to database" });}

  }else {return res.send({ error: "No such email found or could have been already activated " })}
}
/*
-----------------------------------------------
|     FUNCTION FOR ACTIVATING PROFILE
-----------------------------------------------
*/
async function activateprofile(req, res) {
  const object = querystring.parse(req.url);
  // find the data in database
  const databaserecord = await user.findOneAndUpdate(
    { _id: object.DJI, activation_key: object.DJK },
    {
      $set: { status: "activated" },
      $unset: { activation_key: "" },
      activation_time: Date.now(),
    },
    { useFindAndModify: false, new: true }
  );
  // console.log(databaserecord)
  if (databaserecord) {
    const token = jwt.sign(
      {
        DJID: databaserecord._id,
        DJ_email: databaserecord.user_email,
        DJ_name: databaserecord.user_name,
      },
      process.env.jwt_secret
    );
    /* --------Redirect to front end ----------- */
    return res.redirect(`${process.env.frontendbaseurl}/activation?&token=${token}`);
  } else {
    /* --------Redirect to front end ----------- */
    return res.redirect(`${process.env.frontendbaseurl}/activation?&error=Error parsing the activation link`);
  }
}
/*
-----------------------------------------------
|   FUNCTION FOR ADDING MORE PROFILE DETAILS
-----------------------------------------------
*/
async function adduserdetails(req, res) {
  const updatedata = await user.findOneAndUpdate(
    { _id: req.userid, status: "activated" },
    {
      user_birthday: req.body.user_birthday,
      user_gender: req.body.user_gender,
      about: req.body.about,
      interests: await req.body.interests.split(",").filter(x => x !== ""),
    },
    { useFindAndModify: false, new: true }
  );
  if (await updatedata) {
    return res.send({ success: "updated details successfully" });
  } else {
    return res.send({ error: "Error updating to database" });
  }
}
/*
-----------------------------------------------
|   FUNCTION FOR ADDING PROFILE PICTURE
-----------------------------------------------
*/

async function uploadprofilephoto(req, res) {
  profilepicture.upload_dp_pic(req, res);
}

module.exports = {
  createbaseprofile,
  activateprofile,
  adduserdetails,
  uploadprofilephoto,
  resendactivation
};
