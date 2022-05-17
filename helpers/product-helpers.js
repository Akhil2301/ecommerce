var db=require('../config/config');
var collection=require('../config/collection');
const { subCategory } = require('./user-helper');

var objectId=require('mongodb').ObjectId
// const promise=require('promise');
module.exports={
    addProduct:(pro,callback)=>{
        pro.price=parseInt( pro.price)
        db.get().collection('product').insertOne(pro).then((data)=>{
            
            callback(data.insertedId.toString());
//  console.log('add product'+pro)
        
//         pro.image=files
//         return new Promise((resolve,reject)=>{
//             db.get().collection(collection.PRODUCT_COLLECTIOS).insertOne(pro).then((response)=>{
//                resolve(response);
//                console.log('add product'+pro)
//             })
//         })
        });
    },
// addProducts:(body)=>{
    
//     return new Promise((resolve,reject )=>{
//         db.get().collection(collection.PRODUCT_COLLECTIOS).insertOne(body).then((response)=>{
//            resolve(response) ;
//         })
//     })

    
// },
    viewproduct:()=>{
        return new Promise(async (resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTIOS).find().toArray();
            resolve(products)
        })
    },

    deleteProduct:(proid)=>{
        return new Promise((resolve,reject)=>{
            console.log(objectId(proid))
            db.get().collection(collection.PRODUCT_COLLECTIOS).remove({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(proid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTIOS).findOne({_id:objectId(proid)}).then((response)=>{
                resolve(response)
            })
        })
    },

    updateProduct:(prodid,proDetails)=>{
        proDetails.price=parseInt( proDetails.price)
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.PRODUCT_COLLECTIOS).updateOne({_id:objectId(prodid)},{
                $set:{
                    Name:proDetails.Name,
                    Category:proDetails.Category,
                    SubCategory:proDetails.SubCategory,
                    description:proDetails.description,
                    price:proDetails.price
                    
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    }
}