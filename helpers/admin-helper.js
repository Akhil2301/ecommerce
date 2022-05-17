var db=require('../config/config');
var collection=require('../config/collection');
const { subCategory } = require('./user-helper');

var objectId=require('mongodb').ObjectId

module.exports={
    getOrderList:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
             
            resolve(orders)
           
        })
    },
}