/**
 * ----------------------------------------------
 *  CONTROLLER FOR CHAMBER SEARCH OPERATIONS
 * ---------------------------------------------
 */

const mongoose= require('mongoose')
const chamber = require('../model/chamber_schema')
const user = require('../model/users_schema')

/**
 * ----------------------------------------------
 *          SEARCH CHAMBER FUNCTION
 * ---------------------------------------------
 */
async function searchchamber(req,res){
  if(req.body.sortby==='chamberid'){
    chamber.findOne({"_id":req.body.search}).sort({active_user_count:-1}).then(doc=>{
      return res.send({"success":doc})}).catch(err=>{return res.send({"error":"Error finding in database"})})
    }else{ chamber.aggregate([
    (req.body.showonlyactive)?{
      '$match':{
        '$text': {
          '$search':req.body.search
        }, 
        'active_user_count': {
          '$gt': 0
        }
      }
    }:{
      '$match':{
        '$text': {
          '$search':req.body.search
        }
      }
    },{
      '$sort': (req.body.sortby==='activeusers')?{
        'active_user_count': -1
      }:{
        'score': {
          '$meta': 'textScore'
        }
      }
    }, {
      '$facet': {
        'count': [
          {
            '$count': 'count'
          }
        ], 
        'document': [
          {
            '$project': {
              'discuss_history': 0, 
              'scheduled_time': 0, 
              '__v': 0
            }
          },
          {
            '$skip': (req.body.page_number-1)*req.body.items_per_page
          }, {
            '$limit': req.body.items_per_page
          }
        ]
      }
    }, {
      '$unwind': {
        'path': '$count'
      }
    }
  ]).then(doc=>{
    if(doc.length>0){return res.send({"success":doc[0]})}else{return res.send({"error":"No data found"})}
  }).catch(err=>{ console.log(err);return res.send({"error":err})})}
}
/**
 * ----------------------------------------------
 *          SEARCH CHAMBER BY INTEREST
 * ---------------------------------------------
 */
async function findbyinterest(req,res){
    const {interests}= await user.findById({'_id':req.userid},{"interests":1})
    if(await interests.length>0){
        chamber.find({$text:{$search:interests.join(" ")},active_user_count:{$gt:0}},{ score : { $meta: "textScore" },discuss_history:0 }).sort({score:{$meta:"textScore"}}).limit(20).then(doc=>{
          if(doc.length>0){return res.send({"success":doc})}else{return res.send({"error":"not found"})}
        }).catch(err=>{return res.send({"error":"Error finding in database"})})
    }else{return res.send({"error":"Error finding in database"})}
}
/**
 * ----------------------------------------------
 *          SEARCH CHAMBER BY HISTORY
 * ---------------------------------------------
 */
async function findbyhistory(req,res){
    try{
    const dataarray = await user.aggregate([
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(req.userid)
          }
        }, {
          '$unwind': {
            'path': '$joined_chambers'
          }
        }, {
          '$project': {
            'chamber_id': {
              '$toObjectId': '$joined_chambers.chamber_id'
            }
          }
        }, {
          '$lookup': {
            'from': 'chambers', 
            'localField': 'chamber_id', 
            'foreignField': '_id', 
            'as': 'datas'
          }
        }, {
          '$unwind': {
            'path': '$datas'
          }
        }, {
          '$project': {
            'datas.hashtags': 1, 
            '_id': 0, 
            'datas.chamber_name': 1
          }
        }, {
          '$unwind': {
            'path': '$datas.hashtags'
          }
        }, {
          '$group': {
            '_id': 0, 
            'datas1': {
              '$addToSet': '$datas.hashtags'
            }, 
            'datas2': {
              '$addToSet': '$datas.chamber_name'
            }
          }
        }, {
          '$project': {
            '_id': 0, 
            'items': {
              '$concatArrays': [
                '$datas1', '$datas2'
              ]
            }
          }
        }
      ])
      if(dataarray[0].items){
        chamber.find({$text:{$search:await dataarray[0].items.join(' ') },active_user_count:{$gt:0}},{ score : { $meta: "textScore" },discuss_history:0 }).sort({score:{$meta:"textScore"}}).limit(20).then(doc=>{
         if(doc.length>0){return res.send({"success":doc})}else{return res.send({"error":"No data found"})}
        }).catch(err=>{return res.send({"error":"Error finding in database"})})

      }else{return res.send({"error":"No data found"})}
    }catch(err){return res.send({'error':"error searching in database"})}
}
/**
 * ----------------------------------------------
 *          SEARCH CHAMBER BY HISTORY
 * ---------------------------------------------
 */
async function findtrendingchamber(req,res){
  const chambers = await chamber.aggregate([
    {
      '$facet': {
        'chamberdatas': [
          {
            '$project': {
              'active_user_count': 1, 
              'created': 1, 
              'created_by_name': 1, 
              'chamber_name': 1, 
              'chamber_description': 1, 
              'hashtags': 1, 
              'photo_url': 1, 
              'created_by_userid': 1
            }
          }, {
            '$sort': {
              'active_user_count': -1
            }
          }, {
            '$skip': (req.body.page_number-1)*req.body.items_per_page
          }, {
            '$limit': req.body.items_per_page
          }
        ], 
        'totalcount': [
          {
            '$count': 'totaldocs'
          }
        ]
      }
    }, {
      '$unwind': {
        'path': '$totalcount'
      }
    }
  ])
  if(await chambers){
    return res.send({"success":chambers[0]})
  }else{
    return res.send({"error":"error finding chambers"})
  }
}
/**
 * ----------------------------------------------
 *          GET TRENDING HASHTAGS
 * ---------------------------------------------
 */
async function gettrendinghashtag(req,res){
  try{
  const dataarray = await user.aggregate([
    {
        '$sort': {
            'active_user_count': -1
        }
    }, {
        '$limit': 20
    }, {
        '$project': {
            '_id': 0, 
            'hashtags': 1
        }
    }, {
        '$unwind': {
            'path': '$hashtags'
        }
    }, {
        '$group': {
            '_id': '$hashtags', 
            'count': {
                '$sum': 1
            }
        }
    }, {
        '$sort': {
            'count': -1
        }
    }
])
  if(dataarray[0].items){
    return res.send({"success":dataarray})
}else{return res.send({"error":"No data found"})}
}catch(err){return res.send({'error':"error searching in database"})}
}
module.exports={searchchamber,findbyinterest,findbyhistory,findtrendingchamber,gettrendinghashtag}