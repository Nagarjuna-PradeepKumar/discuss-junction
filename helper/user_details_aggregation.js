const user = require('../model/users_schema')
const mongoose=require('mongoose')

async function get_created_details(info){
  return user.aggregate([
    {
      '$match': {
        '_id': new mongoose.Types.ObjectId(info.userid)
      }
    }, {
      '$project': {
        'chamber_history': 1, 
        'count': {
          '$size': '$chamber_history'
        }
      }
    }, {
      '$unwind': {
        'path': '$chamber_history'
      }
    }, {
      '$sort': {
        'chamber_history.date': -1
      }
    }, {
      '$skip': (info.page_number-1)*info.items_per_page
    }, {
      '$limit': info.items_per_page
    }, {
      '$project': {
        'chamber_id': {
          '$toObjectId': '$chamber_history.chamber_id'
        }, 
        'count': 1
      }
    }, {
      '$lookup': {
        'from': 'chambers', 
        'localField': 'chamber_id', 
        'foreignField': '_id', 
        'as': 'created_details'
      }
    }, {
      '$project': {
        '_id': 0, 
        'chamber_id': 0
      }
    }, {
      '$unwind': {
        'path': '$created_details'
      }
    }, {
      '$project': {
        '_id': {
          '$toString': '$created_details._id'
        }, 
        'chamber_name': '$created_details.chamber_name', 
        'chamber_description': '$created_details.chamber_description', 
        'created': '$created_details.created', 
        'hashtags': '$created_details.hashtags', 
        'photo_url': '$created_details.photo_url', 
        'count': '$count'
      }
    }
  ]).then(doc=>{
          return ({"success":doc})
      }).catch(err=>{return {"error":"error"}})
}
async function get_joined_details(info){
  return user.aggregate([
    {
      '$match': {
        '_id': new mongoose.Types.ObjectId(info.userid)
      }
    }, {
      '$project': {
        'joined_chambers': 1, 
        'count': {
          '$size': '$joined_chambers'
        }
      }
    }, {
      '$unwind': {
        'path': '$joined_chambers'
      }
    }, {
      '$sort': {
        'joined_chambers.date': -1
      }
    }, {
      '$project': {
        'chamber_id': {
          '$toObjectId': '$joined_chambers.chamber_id'
        }, 
        'count': 1, 
        'joined_date': '$joined_chambers.date'
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
    },{
      '$skip': (info.page_number-1)*info.items_per_page
    }, {
      '$limit': info.items_per_page
    }, {
      '$project': {
        '_id': {
          '$toString': '$datas._id'
        }, 
        'chamber_name': '$datas.chamber_name', 
        'chamber_description': '$datas.chamber_description', 
        'joined_date': '$joined_date', 
        'hashtags': '$datas.hashtags', 
        'photo_url': '$datas.photo_url', 
        'count': '$count'
      }
    }
  ]).then(doc=>{
        return {"success":doc}
    }).catch(err=>{return {"error":"error"}})
}

module.exports={get_created_details,get_joined_details}