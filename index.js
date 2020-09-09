/**
 * ---------------------------------------------
 * -------- IMPORTING REQUIRED FILES -----------
 * ---------------------------------------------
 */
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const redisAdapter = require("socket.io-redis");
const chamber = require("./model/chamber_schema");
const user = require('./model/users_schema')
const cors = require("cors");
const router = require("./router");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path=require('path')
const dotenv = require("dotenv");
dotenv.config();



/**
 * ---------------------------------------------
 * --------------- PORT SETUP -----------------
 * ---------------------------------------------
 */

const PORT = process.env.PORT || 5000;


/**
 * ---------------------------------------------
 * --------------- REDIS SETUP -----------------
 * ---------------------------------------------
 */
var client = require("./redis/redis_connect");
client.on("error", function (error) {
  console.error("error");
});

/**
 * ---------------------------------------------
 * ----------- SETTINGUP MIDDLEWARES -----------
 * ---------------------------------------------
 */

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server).adapter(
  redisAdapter({host:process.env.redishost, port:process.env.redisport,auth_pass:process.env.redispass})
);

app.use(cors());
app.use("/api", router);

/**
 * ---------------------------------------------
 * ----------- SOCKETIO MANAGEMENT-- -----------
 * ---------------------------------------------
 */

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.jwt_secret, function (
      err,
      decoded
    ) {
      if (err) {
        console.log("error");
        return next(new Error("Authentication error"));
      } else {
        client.set(socket.id,decoded.DJID)
        next();
      }
    });
  } else {
    next(new Error("Authentication error"));
  }
}).on("connect", function (socket) {
  console.log("connected with socket id: " + socket.id);
  socket.emit('confirmconnect', {"success":"connected"});
/**
 * ---------------------------------------------
 *              JOIN A CHAMBER
 * ---------------------------------------------
 */
  socket.on("joinroom", (message /* chamber_id,name,user_Id */, callback) => {
    client.SADD(message.user_id,message.chamber_id,async function(err,reply){
      console.log(reply)
      if(reply===1){
        chamber.findByIdAndUpdate({ _id: message.chamber_id },{ $inc: { active_user_count: 1 } },{useFindAndModify:false}).then((doc) => {
          if(doc){
            console.log("incremented active users")
            socket.join(message.chamber_id, (err) => {
              if (err) {
                callback({ error: err });
              }
            });
            socket.emit('confirmjoiningroom', {"success":message.chamber_id,"name":doc.chamber_name,"photo":doc.photo_url,"count":doc.active_user_count});
            user.findByIdAndUpdate({_id:message.user_id},{$push:{joined_chambers:{chamber_id:message.chamber_id,date:Date.now()}}},{useFindAndModify:false}).then(doc=>console.log('added to user history'))
          }
        }).catch((err) => {console.log("error" + err);
          socket.emit('errorjoiningroom', {"error":message.chamber_id,"message":"Error joining the room"});
        }
      );
      }if(reply===0){
        socket.emit('errorjoiningroom', {"error":message.chamber_id,"message":"you have already joined the room"});
      }
    })
  });
    /**
 * ---------------------------------------------
 *           SEND MY DETAILS TO CHAMBER
 * ---------------------------------------------
 */
socket.on('sendme',(message,callback)=>{
  socket.to(message.chamber_id).emit("userjoined", {
    "chamber_id": message.chamber_id,
    "socketid": socket.id,
    "name": message.name,
    "user_id":message.user_id,
    "message": `${message.name} has joined the chamber`,
  });
})
    /**
 * ---------------------------------------------
 *          SEND ONLINE USERS TO CHAMBER
 * ---------------------------------------------
 */
socket.on('listofusers',(message,callback)=>{
  socket.to(message.chamber_id).emit("listofonlineusers", {
    "chamber_id": message.chamber_id,
    "list":message.list
  })
})
  /**
 * ---------------------------------------------
 *            SEND MESSAGE TO CHAMBER
 * ---------------------------------------------
 */
 socket.on('sendmessage',(message/* roomid,name,message */,callback)=>{
  socket.to(message.chamber_id).emit('receivemessage',{"chamber_id": message.chamber_id,"socketid": socket.id,"name": `${message.name}`,"message":message.message,"userid":message.user_id});
  socket.emit('messagereceipt',{"chamber_id": message.chamber_id,"msgid":message.msgid});
 })
/**
 * ---------------------------------------------
 *            SEND KEYPRESS TO CHAMBER
 * ---------------------------------------------
 */
socket.on('keypress',(message/* roomid,name,message */,callback)=>{
  socket.to(message.chamber_id).emit('keypressreceive',{"chamber_id": message.chamber_id,"socketid": socket.id,"name": `${message.name}`,"message":`${message.name} is typing`});
 })
 /**
 * ---------------------------------------------
 *             LEAVE FROM CHAMBER
 * ---------------------------------------------
 */
socket.on('leavechamber',(message,callback)=>{
  client.srem(message.user_id,message.chamber_id)
  socket.leave(message.chamber_id, () => {
    io.to(message.chamber_id).emit("left",{"socketid":socket.id,"chamber_id":message.chamber_id});
    socket.emit("leftaroom",{"chamber_id":message.chamber_id})
  });
  chamber.findByIdAndUpdate({ _id: message.chamber_id },{ $inc: { active_user_count: -1 } },{useFindAndModify:false}).then(doc=>console.log("reduced"))
})
/**
 * ---------------------------------------------
 *          REMOVE FROM MONGO AND ROOMS
 * ---------------------------------------------
 */
  socket.on("disconnecting", () => {
    var tasks = [];
    client.get(socket.id,(err,reply)=>{
      client.del(reply,(err,reply)=>{if(err){console.log("delusererror: "+err)}if(reply){console.log("deluserreply:"+reply)}})
      client.del(socket.id,(err,reply)=>{if(err){console.log("socketerror: "+err)}if(reply){console.log("socketreply:"+reply)}})
    })
    socket.adapter.clientRooms(socket.id, (err, rooms) => {
      if (err) {
        console.log("error getting details");
      }
      console.log(rooms); // an array containing every room a given id has joined.
      let makeevents = new Promise((resolve, reject) => {
        for (i = 1; i < rooms.length; i++) {
          io.to(rooms[i]).emit("left",{"socketid":socket.id,"chamber_id":rooms[i]})
          tasks.push({
            updateOne: {
              filter: { "_id": { $eq: rooms[i] } },
              update: { "$inc": { "active_user_count": -1 } },
            },
          });
          if (i === rooms.length) {
            resolve(success);
          }
        }
      });
      if(rooms.length>1){makeevents.then(chamber.bulkWrite(tasks).then((result) => console.log('removed from all rooms')));}
    });
  });
  /**
 * ---------------------------------------------
 *              get room data A SOCKET   not yet used
 * ---------------------------------------------
 */
// socket.on('getusers',(message,callback)=>{
//   io.in('5f34f5c7f2fa0e1e9c26ab80').clients((err, clients) => {
//     console.log(clients); // an array containing socket ids in 'room3'
//     socket.to(message.chamber_id).emit('receivemessage',{"chamber_id": message.chamber_id,"socketid": socket.id,"name": `admin`,"message":clients});
//   });
// })
/**
 * ---------------------------------------------
 *              DISCONNET A SOCKET
 * ---------------------------------------------
 */
  socket.on("disconnect", () => {
    console.log(
      "disconnected socket id: " + socket.id
    );
    socket.disconnect(0);
  });
});



if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public"));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
  );
}



/**
 * ---------------------------------------------
 * ------------- SETTINGUP SERVERS -------------
 * ---------------------------------------------
 */
server.listen(process.env.PORT || 5000, () =>
  console.log("server is started at port " + PORT)
);

mongoose.connect(
  process.env.data_connection_string,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
  () => console.log("connected to database")
);