/*
-----------------------------------------------
|       ROUTER FOR HTTP REQUESTS
-----------------------------------------------
*/

const router =require('express').Router()
const signup= require('../controller/signup')
const photos = require('../controller/photos')
const chamber = require('../controller/chamber')
const resetpass = require('../controller/resetpassword')
const userdetails = require('../controller/getuserdetails')
const login =require('../controller/login')
const searchchamber=require('../controller/searchchamber')
const deleteusers=require('../controller/deleteprofile')
const jwtparser =require('../helper/jwt_parser')

/* ------signup and initial profile setup */
router.post('/signup',async (req,res)=>{signup.createbaseprofile(req,res)})
router.get('/activation',async (req,res)=>{signup.activateprofile(req,res)})
router.post('/resendactivation',async (req,res)=>{signup.resendactivation(req,res)})
router.post('/adduserdetails',jwtparser,async (req,res)=>{signup.adduserdetails(req,res)})
router.post('/uploadprofilephoto',jwtparser,async (req,res)=>{signup.uploadprofilephoto(req,res)})
/* ------signup and initial profile setup */

/* -------editing user details----------- */
router.post('/changedetails',jwtparser,async (req,res)=>{signup.adduserdetails(req,res)})
router.post('/deleteprofilephoto',jwtparser,async (req,res)=>{photos.deleteprofilephoto(req,res)})
router.post('/changeprofilephoto',jwtparser,async (req,res)=>{photos.changeprofilephoto(req,res)})
/* -------editing user details----------- */

/* --------- creating chambers----------- */
router.post('/createchamber',jwtparser,async(req,res)=>{chamber.createchamber(req,res)})
router.post('/uploadchamberpicture',jwtparser,async(req,res)=>{chamber.uploadchamberpicture(req,res)})
/* --------- creating chambers----------- */

/* ---------- editing chambers----------- */
router.post('/changechamberdetails',jwtparser,async(req,res)=>{chamber.changechamberdetails(req,res)})
router.post('/changechamberpicture',jwtparser,async(req,res)=>{chamber.changechamberpicture(req,res)})
router.post('/deletechamberpicture',jwtparser,async(req,res)=>{chamber.deletechamberpicture(req,res)})
router.post('/deletechamber',jwtparser,async(req,res)=>{chamber.deletechamber(req,res)})
/* ---------- editing chambers----------- */

/* ---------- reset password----------- */
router.post('/forgotpassword',async(req,res)=>{resetpass.forgotpassword(req,res)})
router.get('/resetpassword',async(req,res)=>{resetpass.resetpassword(req,res)})
router.post('/changeforgotpassword',async(req,res)=>{resetpass.changeforgotpassword(req,res)})
router.post('/changepassword',jwtparser,async(req,res)=>{resetpass.changepassword(req,res)})
/* ---------- reset password----------- */

/* -------------- login --------------- */
router.post('/login',async(req,res)=>{login.login(req,res)})
router.post('/verify',async(req,res)=>{login.verify(req,res)})
/* -------------- login --------------- */

/* -------------- search --------------- */
router.post('/searchchamber',jwtparser,async(req,res)=>{searchchamber.searchchamber(req,res)})
router.post('/findbyinterest',jwtparser,async(req,res)=>{searchchamber.findbyinterest(req,res)})
router.post('/findbyhistory',jwtparser,async(req,res)=>{searchchamber.findbyhistory(req,res)})
router.post('/findbytrending',jwtparser,async(req,res)=>{searchchamber.findtrendingchamber(req,res)})
router.post('/gettrendinghashtag',jwtparser,async(req,res)=>{searchchamber.gettrendinghashtag(req,res)})
/* -------------- search --------------- */

/*--------- Getting user details-------- */
router.post('/getuserdetails',jwtparser,async(req,res)=>userdetails.getuserdetails(req,res))
router.post('/getcreatedchamber',jwtparser,async(req,res)=>userdetails.getcreatedchamberdetail(req,res))
router.post('/getjoinedchamber',jwtparser,async(req,res)=>userdetails.getjoinedchamberdetail(req,res))
/*--------- Getting user details-------- */

/*----------- Delete a profile---------- */
router.post('/deleteprofile',jwtparser,async(req,res)=>deleteusers.deleteprofile(req,res))
/*----------- Delete a profile---------- */

/*------------ check internet ---------- */
router.post('/checknetwork',(req,res)=>{return res.send(true)})
/*------------ check internet ---------- */
module.exports=router